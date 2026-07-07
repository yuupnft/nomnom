import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import Hammer from 'hammerjs';
import { isMobile } from 'react-device-detect';
import saveAs from 'file-saver';
import { Paintbrush, Eraser, Undo2, Lock, Unlock, Download, RotateCcw, FlipHorizontal, FlipVertical } from 'lucide-react';

const toolbarBtnBase =
  'flex items-center gap-1.5 font-gaegu font-bold text-sm px-3 py-2 rounded-full ' +
  'border-2 border-nomnom-brown shadow-kawaii transition-all duration-150 ' +
  'hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer select-none';

const toolbarBtnClass = (active) =>
  `${toolbarBtnBase} ${active ? 'bg-nomnom-pink text-white' : 'bg-nomnom-white text-nomnom-ink'}`;

// Ported from the standalone nomnom-editor (Vite) app. Same fabric.js canvas logic,
// but the canvas now sizes itself to its container (ResizeObserver + window resize)
// instead of the full browser window, so it can live inline in a page section.
const MIN_CANVAS_HEIGHT = 320;
const MAX_CANVAS_HEIGHT = 640;
const CANVAS_ASPECT = 0.8; // height = width * CANVAS_ASPECT, clamped

export default function NomnomEditor() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [group, setGroup] = useState(null);
  const [backLeg, setBackLeg] = useState(null);

  const backLegRef = useRef(null);
  const groupRef = useRef(null); // Useful to have this as a ref too
  const backgroundImgRef = useRef(null);

  const [body, setBody] = useState(null);
  const [originalLegImg, setOriginalLegImg] = useState(null);
  const [maskCanvas, setMaskCanvas] = useState(null);

  const [isMaskMode, setIsMaskMode] = useState(false);
  // Add this ref to keep track of the state for the Hammer/Canvas listeners
  const isMaskModeRef = useRef(isMaskMode);

  const [isEraseBrush, setIsEraseBrush] = useState(true);
  const isEraseBrushRef = useRef(isEraseBrush);

  const [isLocked, setIsLocked] = useState(false);
  const brushSize = 10;
  const [tintFilter] = useState(new fabric.filters.BlendColor({ color: '#ff0000', mode: 'tint', alpha: 0.2 }));
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const [selectedObject, setSelectedObject] = useState(null);
  const [quickActionsPos, setQuickActionsPos] = useState(null);

  const paddingTop = 32;
  const paddingBottom = 128;
  const paddingSides = 64;

  // Update the ref whenever the state changes
  useEffect(() => {
    isMaskModeRef.current = isMaskMode;
  }, [isMaskMode]);

  useEffect(() => {
    isEraseBrushRef.current = isEraseBrush;
  }, [isEraseBrush]);

  useEffect(() => {
    const updateSelection = (e) => {
      // e.target is the object that was just selected
      const active = e.selected?.[0] || e.target;

      if (active) {
        setSelectedObject(active);
      }
    };

    const clearSelection = () => {
      setSelectedObject(null);
      setQuickActionsPos(null);
    };

    const c = new fabric.Canvas(canvasRef.current);
    setCanvas(c);

    // Keep the quick-actions row (flip/mask) pinned just under the nomnom
    // group as it's dragged, scaled, or the canvas is panned/zoomed.
    const updateQuickActionsPos = () => {
      const grp = groupRef.current;
      if (!grp || c.getActiveObject() !== grp) return;
      // getBoundingRect() is in absolute *scene* coordinates (unaffected by pan/zoom),
      // but the DOM overlay needs current on-screen *viewport* pixels — same mismatch
      // fixed for the download crop. Run both corners through the viewportTransform.
      const rect = grp.getBoundingRect();
      const vpt = c.viewportTransform;
      const topLeft = fabric.util.transformPoint({ x: rect.left, y: rect.top }, vpt);
      const bottomRight = fabric.util.transformPoint(
        { x: rect.left + rect.width, y: rect.top + rect.height },
        vpt
      );
      const maxTop = c.height - 44; // keep the row from being clipped by the canvas's own bottom edge
      const top = Math.min(bottomRight.y + 8, maxTop);
      const left = (topLeft.x + bottomRight.x) / 2;
      setQuickActionsPos((prev) => {
        if (prev && Math.abs(prev.top - top) < 0.5 && Math.abs(prev.left - left) < 0.5) return prev;
        return { top, left };
      });
    };

    const getContainerSize = () => {
      const el = containerRef.current;
      const width = el && el.clientWidth ? el.clientWidth : window.innerWidth;
      const height = Math.min(MAX_CANVAS_HEIGHT, Math.max(MIN_CANVAS_HEIGHT, Math.round(width * CANVAS_ASPECT)));
      return { width, height };
    };

    // Size the canvas to its container right away instead of the full window
    const initialSize = getContainerSize();
    c.setDimensions(initialSize);

    // 1. Create the Cursor Object
    const cursor = new fabric.Circle({
      radius: 16, // Half of your 32px brush
      fill: 'transparent',
      stroke: 'white',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      visible: false,
      evented: false, // Don't let the cursor block the mouse
      selectable: false,
      shadow: new fabric.Shadow({
        color: 'black',
        blur: 4,
        offsetX: 0,
        offsetY: 0
      })
    });
    c.add(cursor);



    // v7: .on() returns a disposer function
    const disposeCreated = c.on('selection:created', updateSelection);
    const disposeUpdated = c.on('selection:updated', updateSelection);
    const disposeCleared = c.on('selection:cleared', clearSelection);
    const disposeAfterRender = c.on('after:render', updateQuickActionsPos);

    fabric.FabricObject.prototype.hasControls = !isMobile;

    const hammer = new Hammer.Manager(c.upperCanvasEl);
    hammer.add(new Hammer.Pinch());
    hammer.add(new Hammer.Pan({ threshold: 5 }));
    let isPinching = false;
    let isObjectPinch = false;
    let lastScale = 1;
    let lastObjectScale = 1;
    let lastObjectAngle = 0;

    hammer.on('pinchstart', (ev) => {
      isPinching = true;
      const active = c.getActiveObject();
      if (active) {
        isObjectPinch = true;
        lastObjectScale = active.scaleX;
        lastObjectAngle = active.angle;
      } else {
        isObjectPinch = false;
        lastScale = c.getZoom();
      }
    });
    hammer.on('pinchend pinchcancel', () => {
      isPinching = false;
      isObjectPinch = false;
    });
    hammer.on('pinchmove', (ev) => {
      if (isMaskModeRef.current) return;
      if (isObjectPinch) {
        const scale = lastObjectScale * ev.scale;
        const angle = lastObjectAngle + ev.rotation;
        const active = c.getActiveObject();
        if (active) {
          active.set({ scaleX: scale, scaleY: scale, angle });
          active.setCoords();
          c.renderAll();
        }
      } else {
        const zoom = lastScale * ev.scale;
        c.zoomToPoint(new fabric.Point(ev.center.x, ev.center.y), zoom);
      }
    });

    hammer.on('panstart panmove', (ev) => {
      if (isMaskModeRef.current) return;
      if (isPinching) return;
      if (isMaskModeRef.current && ev.pointers.length < 2) return;
      if (!isMaskModeRef.current && c.getActiveObject()) return;
      if (ev.type === 'panstart') {
        lastPos.current.x = c.viewportTransform[4];
        lastPos.current.y = c.viewportTransform[5];
      }
      c.viewportTransform[4] = lastPos.current.x + ev.deltaX;
      c.viewportTransform[5] = lastPos.current.y + ev.deltaY;
      c.requestRenderAll();
    });

    let isMousePanning = false;
    let isMouseDown = false;
    let lastX = 0;
    let lastY = 0;

    c.on('mouse:down', (opt) => {
      // if (opt.target || isMaskModeRef.current) {
      //   if (isMaskModeRef.current) isMouseDown = true;
      //   return;
      // }
      // isMousePanning = true;
      // lastX = opt.e.clientX;
      // lastY = opt.e.clientY;
      if (isMaskModeRef.current) {
        isMouseDown = true;

        // Add an initial "stamp" right where the user clicked
        // Manual pointer calculation for Fabric v7
        const pointer = {
          x: (opt.e.offsetX - c.viewportTransform[4]) / c.getZoom(),
          y: (opt.e.offsetY - c.viewportTransform[5]) / c.getZoom()
        };

        const m = backLegRef.current.calcTransformMatrix();
        const invertedM = fabric.util.invertTransform(m);
        const localPoint = fabric.util.transformPoint(pointer, invertedM);

        const brushTip = new fabric.Circle({
          radius: 16,
          left: localPoint.x,
          top: localPoint.y,
          originX: 'center',
          originY: 'center',
          scaleX: 1 / (backLegRef.current.scaleX * groupRef.current.scaleX),
          scaleY: 1 / (backLegRef.current.scaleY * groupRef.current.scaleY),
          fill: 'black',
          globalCompositeOperation: isEraseBrushRef.current ? 'destination-out' : 'source-over'
        });

        if (backLegRef.current.clipPath) {
          backLegRef.current.clipPath.add(brushTip);
          backLegRef.current.set('dirty', true);
          c.requestRenderAll();
        }
        return; // Stop here so we don't trigger panning logic
      }

      // Your existing panning logic for when NOT in mask mode
      if (opt.target) return;
      isMousePanning = true;
      lastX = opt.e.clientX;
      lastY = opt.e.clientY;
    });

    c.on('mouse:up', (opt) => {
      isMouseDown = false;
      isMousePanning = false;
    });

    c.on('mouse:move', (opt) => {
      if (isMousePanning) {
        const deltaX = opt.e.clientX - lastX;
        const deltaY = opt.e.clientY - lastY;
        c.viewportTransform[4] += deltaX;
        c.viewportTransform[5] += deltaY;
        c.renderAll();
        lastX = opt.e.clientX;
        lastY = opt.e.clientY;
      } else if (isMaskModeRef.current) { // Always check the Ref for the current state
        // Manual calculation to ensure accuracy across all v7 versions
        // This maps browser pixels to canvas scene coordinates
        const pointer = {
          x: (opt.e.offsetX - c.viewportTransform[4]) / c.getZoom(),
          y: (opt.e.offsetY - c.viewportTransform[5]) / c.getZoom()
        };

        cursor.set({ visible: true, left: pointer.x, top: pointer.y });
        // Bring cursor to front so it's always visible above the tint filters
        c.bringObjectToFront(cursor);

        // 2. REAL-TIME ERASURE LOGIC
        if (isMouseDown && backLegRef.current && backLegRef.current.clipPath) {
          // Calculate local coordinates for the "stamp"
          const m = backLegRef.current.calcTransformMatrix();
          const invertedM = fabric.util.invertTransform(m);
          const localPoint = fabric.util.transformPoint(new fabric.Point(pointer.x, pointer.y), invertedM);

          // Create a small circle 'stamp' to act as the brush tip
          const brushTip = new fabric.Circle({
            radius: 16, // Match your brush radius
            left: localPoint.x,
            top: localPoint.y,
            originX: 'center',
            originY: 'center',
            // Scale it inversely just like we did for the path
            scaleX: 1 / (backLegRef.current.scaleX * groupRef.current.scaleX),
            scaleY: 1 / (backLegRef.current.scaleY * groupRef.current.scaleY),
            fill: 'black',
            globalCompositeOperation: isEraseBrushRef.current ? 'destination-out' : 'source-over'
          });

          backLegRef.current.clipPath.add(brushTip);
          backLegRef.current.set('dirty', true);
        }

        c.requestRenderAll();
      } else {
        if (cursor.visible) {
          cursor.set({ visible: false });
          c.requestRenderAll();
        }
      }
    });

    c.on('mouse:wheel', (opt) => {
      if (isMaskModeRef.current) return;
      const delta = opt.e.deltaY;
      let zoom = c.getZoom();
      zoom *= Math.pow(0.999, delta);
      c.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
    });

    // Resize the canvas + reposition the image/nomnom group when the container
    // (or window) changes size, instead of staying pinned to the size at upload time.
    const handleResize = () => {
      const { width, height } = getContainerSize();
      c.setDimensions({ width, height });

      const bgImg = backgroundImgRef.current;
      const grp = groupRef.current;
      if (!bgImg) {
        c.renderAll();
        return;
      }

      c.setViewportTransform([1, 0, 0, 1, 0, 0]);

      const offsetX = grp ? grp.left - bgImg.left : 0;
      const offsetY = grp ? grp.top - bgImg.top : 0;
      const prevScale = bgImg.scaleX || 1;

      const availableWidth = width - paddingSides;
      const availableHeight = height - (paddingTop + paddingBottom);
      const ratio = Math.min(availableWidth / bgImg.width, availableHeight / bgImg.height);

      bgImg.set({
        scaleX: ratio,
        scaleY: ratio,
        originX: 'center',
        originY: 'center',
        left: width / 2,
        top: paddingTop + (availableHeight / 2)
      });

      if (grp) {
        grp.set({
          left: bgImg.left + offsetX * (ratio / (prevScale || 1)),
          top: bgImg.top + offsetY * (ratio / (prevScale || 1))
        });
      }

      c.renderAll();
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      // Simply call the disposers to clean up
      disposeCreated();
      disposeUpdated();
      disposeCleared();
      disposeAfterRender();

      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();

      c.dispose();
    }
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = await fabric.FabricImage.fromURL(url);
      const containerWidth = containerRef.current ? containerRef.current.clientWidth : window.innerWidth;
      const containerHeight = Math.min(MAX_CANVAS_HEIGHT, Math.max(MIN_CANVAS_HEIGHT, Math.round(containerWidth * CANVAS_ASPECT)));
      canvas.setDimensions({
        width: containerWidth,
        height: containerHeight
      });

      // 2. Scale the image to fit the window
      //const ratio = Math.min(window.innerWidth / img.width, window.innerHeight / img.height);
      // 1. Calculate available space
      const availableWidth = containerWidth - paddingSides;
      const availableHeight = containerHeight - (paddingTop + paddingBottom);

      // 2. Get the scale ratio
      const ratio = Math.min(availableWidth / img.width, availableHeight / img.height);

      // 3. Position the image
      img.set({
        scaleX: ratio,
        scaleY: ratio,
        originX: 'center',
        originY: 'center',
        left: containerWidth / 2,
        // This math finds the center point BETWEEN your top and bottom padding:
        top: paddingTop + (availableHeight / 2)
      });

      // 4. Assign and render
      canvas.backgroundImage = img;
      canvas.renderAll();

      setBackgroundImg(img);
      backgroundImgRef.current = img;
      await addNomnom(img);
    }
  };

  const addNomnom = async (bgImg) => {
    const legImg = await fabric.FabricImage.fromURL('/nomnom-editor/nomnom_back_leg.png');
    setOriginalLegImg(legImg.getElement());
    const w = legImg.width;
    const h = legImg.height;
    const maskC = document.createElement('canvas');
    maskC.width = w;
    maskC.height = h;
    const ctx = maskC.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);
    setMaskCanvas(maskC);
    const bodyImg = await fabric.FabricImage.fromURL('/nomnom-editor/nomnom_body.png');
    legImg.set({
      left: bgImg.left,
      top: bgImg.top,
      originX: 'center',
      originY: 'center',
      // Optional: Scale the new image if it's larger than the background
      // For example, making it 50% the width of the background:
      scaleX: (bgImg.getScaledWidth() * 0.5) / legImg.width,
      scaleY: (bgImg.getScaledWidth() * 0.5) / legImg.width
    });
    bodyImg.set({
      left: bgImg.left,
      top: bgImg.top,
      originX: 'center',
      originY: 'center',
      // Optional: Scale the new image if it's larger than the background
      // For example, making it 50% the width of the background:
      scaleX: (bgImg.getScaledWidth() * 0.5) / bodyImg.width,
      scaleY: (bgImg.getScaledWidth() * 0.5) / bodyImg.width,
    });
    const g = new fabric.Group([legImg, bodyImg], {
      left: bgImg.left,
      top: bgImg.top,
      originX: 'center',
      originY: 'center'
    });
    canvas.add(g);
    canvas.setActiveObject(g);
    setGroup(g);
    setBackLeg(legImg);
    setBody(bodyImg);

    // Update the refs so the listeners can see them
    groupRef.current = g;
    backLegRef.current = legImg;
  };

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const handlePathCreated = (e) => {
      if (isMaskModeRef.current && backLeg) {
        const path = e.path;
        canvas.remove(path);

        // 1. Calculate the TOTAL scale of the object (Leg * Group)
        const totalScaleX = backLeg.scaleX * group.scaleX;
        const totalScaleY = backLeg.scaleY * group.scaleY;

        // 2. Get the transformation matrix to calculate local offset
        const m = backLeg.calcTransformMatrix();
        const invertedM = fabric.util.invertTransform(m);

        // 3. Transform the path's center point into local space
        const localPoint = fabric.util.transformPoint(path.getCenterPoint(), invertedM);

        // 4. Create the path, setting its scale to the INVERSE of the object's scale
        // This makes the brush stroke "cancel out" the object's shrinking effect
        const localPath = new fabric.Path(path.path, {
          ...path,
          left: localPoint.x,
          top: localPoint.y,
          originX: 'center',
          originY: 'center',
          // Inverse scaling: If totalScale is 0.5, scale becomes 2.0
          stroke: 'black',
          fill: 'transparent',
          scaleX: 1 / totalScaleX,
          scaleY: 1 / totalScaleY,
          globalCompositeOperation: isEraseBrush ? 'destination-out' : 'source-over'
        });

        if (backLeg.clipPath) {
          backLeg.clipPath.add(localPath);

          // Crucial: Dirty the objects to force a redraw
          backLeg.set('dirty', true);
          backLeg.clipPath.set('dirty', true);

          canvas.requestRenderAll();
        }
      }
    };

    canvas.on('path:created', handlePathCreated);

    if (isMaskMode) {
      group.selectable = false;
      // add tint filter to the background and body image
      backgroundImg.filters = [tintFilter];
      backgroundImg.applyFilters();
      body.filters = [tintFilter];
      body.applyFilters();
      canvas.renderAll();
    } else {
      if (group) {
        group.selectable = !isLocked;
        body.filters = [];
        body.applyFilters();
      }
      if (backgroundImg) {
        backgroundImg.filters = [];
        backgroundImg.applyFilters();
      }
      canvas.renderAll();
    }

    return () => {
      canvas.off('path:created', handlePathCreated);
    }
  }, [isMaskMode, isEraseBrush, canvas, group, backgroundImg, body, backLeg, tintFilter, isLocked]);

  const toggleMask = () => {
    if (!backLeg) return;
    const enteringMaskMode = !isMaskMode;

    if (enteringMaskMode) {
      if (!backLeg.clipPath) {
        // Local coordinate base mask: 0,0 is the center of the image
        const baseMask = new fabric.Rect({
          width: backLeg.width,
          height: backLeg.height,
          fill: 'black',
          originX: 'center',
          originY: 'center',
          left: 0,
          top: 0
        });

        backLeg.clipPath = new fabric.Group([baseMask], {
          originX: 'center',
          originY: 'center',
          absolutePositioned: false // Use local space
        });
      }

      //canvas.isDrawingMode = true;
      // new
      canvas.isDrawingMode = false;
      canvas.selection = false;
      //

      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = 32;

      canvas.freeDrawingBrush.color = 'transparent';

      group.set({ selectable: false, evented: false });
    } else {
      canvas.isDrawingMode = false;
      canvas.selection = true;

      group.set({ selectable: !isLocked, evented: true });

      const cursorObj = canvas.getObjects().find(o => o.stroke === 'white' && o.radius === 16);
      if (cursorObj) cursorObj.set({ visible: false });
    }

    setIsMaskMode(enteringMaskMode);
    backLeg.dirty = true;
    canvas.requestRenderAll();
  };

  const setErase = () => setIsEraseBrush(true);
  const setUndo = () => setIsEraseBrush(false);
  const toggleLock = () => {
    setIsLocked(!isLocked);
    if (!isMaskMode && group) {
      group.selectable = !isLocked;
    }
  };

  const flip = (horizontal) => {
    if (!canvas || !group) return;
    if (horizontal) {
      group.set('flipX', !group.flipX);
    } else {
      group.set('flipY', !group.flipY);
    }
    canvas.renderAll();
  };

  const download = () => {
    // getBoundingRect() returns the image's box in absolute *scene* coordinates,
    // but canvas.toDataURL()'s crop options are interpreted in the canvas's
    // current on-screen *viewport* pixel space — so we have to run the rect
    // through the current viewportTransform (pan + zoom) to line the two up.
    // Without this, panning before downloading crops the wrong region.
    const rect = backgroundImg.getBoundingRect();
    const vpt = canvas.viewportTransform;
    const topLeft = fabric.util.transformPoint({ x: rect.left, y: rect.top }, vpt);
    const bottomRight = fabric.util.transformPoint(
      { x: rect.left + rect.width, y: rect.top + rect.height },
      vpt
    );
    const cropWidth = bottomRight.x - topLeft.x;
    const cropHeight = bottomRight.y - topLeft.y;

    // The canvas is shown shrunk down to fit the editor UI, so exporting at
    // 1x captures that small on-screen size. Scale the export back up so the
    // output matches the uploaded photo's original resolution instead.
    const multiplier = backgroundImg.width / cropWidth;

    const url = canvas.toDataURL({
      format: 'png',
      left: topLeft.x,
      top: topLeft.y,
      width: cropWidth,
      height: cropHeight,
      multiplier,
    });
    saveAs(url, 'nomnom.png');
  };

  const resetView = () => {
    if (!canvas || !backgroundImg || !group) return;

    // 1. Reset the "Camera" (zoom and pan) to default
    // [scaleX, skewY, skewX, scaleY, translateX, translateY]
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    // 1. Calculate the CURRENT offset (how far is secondImg from backgroundImg center?)
    // We use the difference in their coordinates
    const offsetX = group.left - backgroundImg.left;
    const offsetY = group.top - backgroundImg.top;

    // 2. Re-calculate your padded dimensions
    const availableWidth = canvas.width - paddingSides;
    const availableHeight = canvas.height - (paddingTop + paddingBottom);

    // 3. Re-calculate the initial scale ratio
    const ratio = Math.min(
      availableWidth / backgroundImg.width,
      availableHeight / backgroundImg.height
    );

    // 4. Reposition and rescale the background image
    backgroundImg.set({
      scaleX: ratio,
      scaleY: ratio,
      originX: 'center',
      originY: 'center',
      left: canvas.width / 2,
      top: paddingTop + (availableHeight / 2)
    });

    group.set({
      left: backgroundImg.left + offsetX * (backgroundImg.scaleX / (ratio || 1)),
      top: backgroundImg.top + offsetY * (backgroundImg.scaleX / (ratio || 1))
    })

    // 5. Update the canvas
    canvas.renderAll();
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '1rem',
        backgroundImage:
          'linear-gradient(to right, rgba(26,18,9,0.08) 1px, transparent 1px), ' +
          'linear-gradient(to bottom, rgba(26,18,9,0.08) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {!backgroundImg && (
        <div
          onClick={() => fileInputRef.current.click()}
          style={{ position: 'absolute', inset: 0, zIndex: 10 }}
          className="flex flex-col items-center justify-center gap-2 cursor-pointer
                     border-2 border-dashed border-nomnom-brown/25 rounded-2xl m-2
                     bg-nomnom-white/70 hover:bg-nomnom-blush/40 transition-colors duration-200"
        >
          <span className="text-4xl">🐹</span>
          <p className="font-gaegu font-bold text-lg text-nomnom-ink">Tap to upload image</p>
          <p className="font-gaegu text-sm text-nomnom-ink/50">nomnom is ready to nom</p>
        </div>
      )}
      <canvas ref={canvasRef} />
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUpload} accept="image/*" />
      {selectedObject && group && selectedObject === group && (
        <div
          style={
            quickActionsPos
              ? { position: 'absolute', top: quickActionsPos.top, left: quickActionsPos.left, transform: 'translateX(-50%)', zIndex: 10 }
              : { position: 'absolute', bottom: 65, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }
          }
          className="flex flex-wrap justify-center gap-2 px-2">
          <button onClick={() => flip(true)} className={toolbarBtnClass(false)}>
            <FlipHorizontal size={16} strokeWidth={2.5} />
            Flip H
          </button>
          <button onClick={() => flip(false)} className={toolbarBtnClass(false)}>
            <FlipVertical size={16} strokeWidth={2.5} />
            Flip V
          </button>
          <button onClick={toggleMask} className={toolbarBtnClass(isMaskMode)}>
            <Paintbrush size={16} strokeWidth={2.5} />
            Mask
          </button>
        </div>
      )}
      {backgroundImg && (
        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
             className="flex flex-wrap justify-center gap-2 px-2">
          <button onClick={toggleMask} className={toolbarBtnClass(isMaskMode)}>
            <Paintbrush size={16} strokeWidth={2.5} />
            Mask
          </button>
          {isMaskMode && (
            <>
              <button onClick={setErase} className={toolbarBtnClass(isEraseBrush)}>
                <Eraser size={16} strokeWidth={2.5} />
                Erase
              </button>
              <button onClick={setUndo} className={toolbarBtnClass(!isEraseBrush)}>
                <Undo2 size={16} strokeWidth={2.5} />
                Undo
              </button>
            </>
          )}
          <button onClick={toggleLock} className={toolbarBtnClass(isLocked)}>
            {isLocked ? <Lock size={16} strokeWidth={2.5} /> : <Unlock size={16} strokeWidth={2.5} />}
            {isLocked ? 'Locked' : 'Unlocked'}
          </button>
          <button onClick={download} className={toolbarBtnClass(false)}>
            <Download size={16} strokeWidth={2.5} />
            Download
          </button>
          <button onClick={resetView} className={toolbarBtnClass(false)}>
            <RotateCcw size={16} strokeWidth={2.5} />
            Reset View
          </button>
        </div>
      )}
    </div>
  );
}

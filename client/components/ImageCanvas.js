import React, { useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';

import styles from '../styles/Memes.module.css';

function ImageCanvas() {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (!canvas) {
      const canvasInstance = new fabric.Canvas(canvasRef.current);
      setCanvas(canvasInstance);
    }

    return () => {
      if (canvas) {
        canvas.dispose();
        setCanvas(null);
      }
    };
  }, [canvas]);

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageDataUrl = event.target.result;
        try {
          const img = await fabric.Image.fromURL(imageDataUrl);
          canvas.add(img);
          canvas.renderAll();
        } catch (error) {
          console.error("Failed to load image:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetBackground = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = event.target.result;
        try {
          fabric.FabricImage.fromURL(img).then((oImg) => {
            if (!canvasContainerRef.current) {
              return;
            }

            const { width, height } = canvasContainerRef.current.getBoundingClientRect();
            const containerWidth = width;
            const containerHeight = height;

            // Calculate the scaling factors for both width and height
            const scaleX = containerWidth / oImg.width;
            const scaleY = containerHeight / oImg.height;

            // Use the smaller scaling factor to maintain aspect ratio
            const scale = Math.min(scaleX, scaleY);

            // Set canvas size to fit the scaled image
            canvas.setWidth(oImg.width * scale);
            canvas.setHeight(oImg.height * scale);

            // Scale and set the background image
            oImg.scale(scale);
            oImg.set({
              originX: 'left',
              originY: 'top'
            });

            // Assign the background image and render the canvas
            canvas.backgroundImage = oImg;
            canvas.requestRenderAll();
          });
        } catch (error) {
          console.error("Failed to load background image:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
      });

      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'exported-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <div ref={canvasContainerRef} className={styles.canvasContainer}>
        <canvas ref={canvasRef} width={500} height={400} />
      </div>
      <div>
        <input type="file" onChange={handleAddImage} accept="image/*" />
        <label>Add Image</label>
      </div>
      <div>
        <input type="file" onChange={handleSetBackground} accept="image/*" />
        <label>Set Background</label>
      </div>
      <button onClick={handleExport}>Export</button>
    </div>
  );
}

export default ImageCanvas;

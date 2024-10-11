import { useEffect } from 'react';

export default function Memes() {
  // useEffect(() => {
  //   // Optionally load external JavaScript here if needed
  //   const firstScript = document.createElement('script');
  //   firstScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js'; // Example for external JS
  //   firstScript.onload = function() {
  //     const secondScript = document.createElement('script');
  //     secondScript.src = '/static/meme-maker.js'; // Example for external JS
  //     document.body.appendChild(secondScript);
  //   }
  //   document.body.appendChild(firstScript);
  // }, []);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <meta property="og:image" content="/presets/3.png"/>
            <meta
                    property="og:description"
                    content="$nomnom 6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump"
            />
            <meta name="twitter:image" content="/presets/3.png"/>
            <meta name="twitter:title" content="Nomnom meme editor"/>
            <meta
                    name="twitter:description"
                    content="$nomnom 6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump"
            />
            <meta name="twitter:image" content=""/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link
                    href="https://fonts.googleapis.com/css2?family=Gaegu&display=swap"
                    rel="stylesheet"
            />
            <link rel="stylesheet" href="/static/meme-maker.css"/>
            <title>Nomnom meme editor</title>
        </head>
        <body class="gaegu-regular">
          <header>
              <img src="/logo-nav.png" alt="nomnom logo"/>
          </header>
          <div class="container gaegu-regular">
              <div>
                <h1>meme editor</h1>
              </div>
              <div class="top-button">
                  <label for="uploadImage" class="upload-button">📷 Upload Image</label>
                  <input
                          type="file"
                          id="uploadImage"
                          accept="image/*"
                          style="display: none"
                  />
              </div>
              <div class="top-button">
                  <label for="uploadBG" class="upload-button">🖼️ Upload Background</label>
                  <input
                          type="file"
                          id="uploadBG"
                          accept="image/*"
                          style="display: none"
                  />
              </div>
              <div class="action-buttons">
                  <button id="undo" disabled>Undo</button>
                  <button id="redo" disabled>Redo</button>
                  <button id="flipHorizontal" disabled>Flip Horizontal</button>
                  <button id="flipVertical" disabled>Flip Vertical</button>
                  <button id="removeAll" disabled>Remove All Overlays</button>
                  <button id="removeSelected" disabled>Remove Selected Preset</button>
                  <!-- New button -->
              </div>
              <div class="text-controls">
                  <input type="text" id="textInput" class="input" placeholder="Enter text"/>
                  <input type="color" id="textColor" value="#000000"/>
                  <input type="number" id="fontSize" class="input" placeholder="Font size" value="40"/>
              </div>
              <div class="text-controls checkbox">
                  <label><input type="checkbox" id="bold" checked/> Bold</label>
                  <label><input type="checkbox" id="italic"/> Italic</label>
                  <label><input type="checkbox" id="dropShadow"/> Drop Shadow</label>
              </div>
              <div class="text-controls">
                  <button id="addText" disabled>Add Text</button>
                  <button id="removeText" disabled>Remove Selected Text</button>
              </div>
              <div class="button-container">
                  <button id="download" class="download-button gaegu-regular" disabled>
                      ⬇️ Download
                  </button>
              </div>
              <canvas id="canvas" width="800" height="600"></canvas>
              <div class="presets">
                  <h2 id="presetstitle">nomnom pfps</h2>
                  <div id="accordion"></div>
              </div>
          </div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js"></script>
          <script src="/static/meme-maker.js"></script>
        </body>
        </html>
      `}} />
    </div>
  );
}

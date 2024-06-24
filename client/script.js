const MEMES_FOLDER = "assets/all-nonom-memes"
const TOTAL_IMAGE_COUNT = 319;
document.addEventListener('DOMContentLoaded', function() {
  
    let lastX = 0;
    let lastY = 0;
    const moveThreshold = 20; // Adjust this value as needed
    const preloadCount = 5; // Number of images to preload
    const preloadedImages = [];
    let currentIndex = 0;


    function preloadImage(imageFolder, imageIndex) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = `${imageFolder}/image_${imageIndex}.jpg`;
            img.onload = () => resolve(img.src);
        });
    }
    
    async function preloadInitialImages(imageFolder, numberOfImages) {
        for (let i = 0; i < preloadCount; i++) {
            const imageIndex = Math.floor(Math.random() * numberOfImages) + 1;
            const imagePath = await preloadImage(imageFolder, imageIndex);
            preloadedImages.push(imagePath);
        }
        // Set the initial image
        setInitialBackground('hero');
    }
    
    function setInitialBackground(divId) {
        if (preloadedImages.length === 0) return;
    
        const div = document.getElementById(divId);
        const initialImagePath = preloadedImages[0];
        div.style.backgroundImage = `url(${initialImagePath})`;
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'center';
    }
    
    function setRandomBackground(divId, imageFolder, numberOfImages) {
        if (preloadedImages.length === 0) return;
    
        currentIndex = (currentIndex + 1) % preloadCount;
        const div = document.getElementById(divId);
        const imagePath = preloadedImages[currentIndex];
        div.style.backgroundImage = `url(${imagePath})`;
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'center';
    
        // Preload a new random image to replace the one just used
        preloadNextImage(imageFolder, numberOfImages);
    }
    
    async function preloadNextImage(imageFolder, numberOfImages) {
        const imageIndex = Math.floor(Math.random() * numberOfImages) + 1;
        const imagePath = await preloadImage(imageFolder, imageIndex);
        // Replace the current index with the newly loaded image
        preloadedImages[currentIndex] = imagePath;
    }
    
    function handleMoveEvent(event) {
        let clientX, clientY;
    
        if (event.type === 'mousemove') {
            clientX = event.clientX;
            clientY = event.clientY;
        } else if (event.type === 'touchmove') {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        }
    
        const distance = Math.sqrt(Math.pow(clientX - lastX, 2) + Math.pow(clientY - lastY, 2));
    
        if (distance > moveThreshold) {
            lastX = clientX;
            lastY = clientY;
            setRandomBackground('hero', MEMES_FOLDER, TOTAL_IMAGE_COUNT);
        }
    }

    const heroDiv = document.getElementById('hero');
    preloadInitialImages(MEMES_FOLDER, TOTAL_IMAGE_COUNT).then(() => {
        heroDiv.addEventListener('mousemove', handleMoveEvent);
        heroDiv.addEventListener('touchmove', handleMoveEvent);
    });


    document.querySelector('.ca-box').addEventListener('click', function() {
        const content = this.querySelector(".ca").innerText;
        navigator.clipboard.writeText(content).then(() => {
            const message = document.querySelector('.copied-message');
            message.style.display = 'block'; 
            setTimeout(() => {
              message.style.display = 'none'; 
            }, 3000);
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      });

      const dynamicImages = Array.from({ length: TOTAL_IMAGE_COUNT }, (el, i) => {
        return `${MEMES_FOLDER}/image_${i+1}.jpg`;
      });

      const galleryWrapper = document.querySelector(".gallery")
      const msnry = new Masonry(galleryWrapper, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-item',
        percentPosition: true
      });

    const glightbox = GLightbox({
        
        dynamic: true,
        touchNavigation: true,
        loop: true,
        autoplayVideos: true,
    });
   
    function addImages(imageArray) {
        const fragment = document.createDocumentFragment();
        imageArray.forEach(src => {
          const div = document.createElement('div');
          div.className = 'grid-item';
          div.innerHTML = `<a href="${src}" class="glightbox"><img data-src="${src}" class="lazyload" alt="nomnom meme" /></a>`;
          fragment.appendChild(div);
        });
        galleryWrapper.appendChild(fragment);
        msnry.appended(fragment.children);
        msnry.layout();
        glightbox.reload();
      }

      addImages(dynamicImages);
      msnry.layout();
      glightbox.reload();
});
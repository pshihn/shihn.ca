(() => {
  const canvas = document.querySelector('#stippleCanvas');
  let canvasEnabled = false;
  let sc = null;
  let currentImage = '/stuff/home/lightning.png';

  const drawImage = () => {
    if (sc && currentImage) {
      sc.drawImage(currentImage, true);
    }
  }

  const initialize = async () => {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    if (ww > 900) {
      let dx = 0;
      let dy = 0;
      let w = ww - 628;
      if (w > 1000) {
        dx = (w - 1000) / 2;
        w = 1000;
      }
      let h = Math.round(wh - 60);
      if (h > 960) {
        dy = (h - 960) / 2;
        h = 960;
      }
      canvas.width = w;
      canvas.height = h;
      canvas.style.display = 'block';
      canvasEnabled = true;
    } else {
      canvas.style.display = 'none';
      canvasEnabled = false;
    }
    if (canvasEnabled && !sc) {
      const n = 10000;
      sc = Stippling.canvas(canvas, '/stuff/home/worker.js', n);
      await sc.start();
      drawImage();
    }
  }

  initialize();

  window.addEventListener('resize', async () => {
    await initialize();
    drawImage();
  }, {
    passive: true
  });

  document.querySelectorAll('#postSection .card-link').forEach((n) => {
    n.addEventListener('mouseover', () => {
      const image = n.dataset.image;
      if (image && image !== currentImage) {
        currentImage = image;
        drawImage();
      }
    });
  });

})();
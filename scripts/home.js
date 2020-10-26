import Legra from 'legra';
import 'stippled-image';

const slider = document.getElementById('range');
const legraCanvas = document.querySelector('#legraCanvas');
const legraCtx = legraCanvas.getContext('2d');
const radioPanel = document.querySelector('#radioPanel');
const rLego = document.querySelector('#rLego');
const rNormal = document.querySelector('#rNormal');
const stippled = document.querySelector('stippled-image');
const faceImage = document.querySelector('#faceImage');
const rangeContainer = document.querySelector('#rangeContainer');

const loadImage = async (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.addEventListener('load', () => {
      resolve(img);
    });
    img.addEventListener('error', () => {
      reject(new Error('Failed to load image'));
    });
    img.addEventListener('abort', () => {
      reject(new Error('Image load aborted'));
    });
    img.src = src;
  });
};

const drawMonalisa = async () => {
  try {
    const legra = new Legra(legraCtx, slider.value);
    const img = await loadImage('/stuff/face.jpg');
    legraCtx.clearRect(0, 0, legraCanvas.width, legraCanvas.height);
    legra.drawImage(img, [0, 0], [Math.ceil(legraCanvas.width / slider.value), Math.ceil(legraCanvas.height / slider.value)]);
  } catch (err) {
    console.error(err);
  }
};

const drawStippled = () => {
  const sv = slider.value;
  const m = 95 / 24;
  const c = 5 - (6 * m);
  const sampling = (m * sv) + c;
  stippled.src = '/stuff/face.jpg';
  stippled.sampling = sampling;
};

let _renderStyle = 'normal';

const renderCanvas = () => {
  switch (_renderStyle) {
    case 'lego':
      drawMonalisa();
      break;
    case 'stippled':
      drawStippled();
      break;
    default:
      break;
  }
};

const onRadioChange = () => {
  if (rLego.checked) {
    _renderStyle = 'lego';
    legraCanvas.style.display = 'block';
    stippled.style.display = 'none';
    faceImage.style.display = 'none';
    rangeContainer.style.visibility = 'visible';
  } else if (rNormal.checked) {
    _renderStyle = 'normal';
    legraCanvas.style.display = 'none';
    stippled.style.display = 'none';
    faceImage.style.display = 'block';
    rangeContainer.style.visibility = 'hidden';
  } else {
    _renderStyle = 'stippled';
    legraCanvas.style.display = 'none';
    stippled.style.display = 'block';
    faceImage.style.display = 'none';
    rangeContainer.style.visibility = 'visible';
  }
  renderCanvas();
};

rNormal.checked = true;
radioPanel.addEventListener('change', onRadioChange);
slider.addEventListener('input', () => {
  renderCanvas();
});
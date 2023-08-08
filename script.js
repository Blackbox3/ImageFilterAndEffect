const uploadInput = document.getElementById('uploadInput');
const imageCanvas = document.getElementById('imageCanvas');
const ctx = imageCanvas.getContext('2d');
const filterButtons = document.getElementById('filterButtons');

// Function to load image on canvas
function loadImageOnCanvas(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const aspectRatio = img.width / img.height;
      const canvasWidth = imageCanvas.clientWidth;
      const canvasHeight = canvasWidth / aspectRatio;
      imageCanvas.width = canvasWidth;
      imageCanvas.height = canvasHeight;
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Event listener for file input change
uploadInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    loadImageOnCanvas(file);
  }
});

// Function to apply filters
function applyFilter(filter) {
  const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
  const data = imageData.data;

  // Call the appropriate filter function based on the selected filter option
  switch (filter) {
    case 'Grayscale':
      applyGrayscaleFilter(data);
      break;
    case 'Sepia':
      applySepiaFilter(data);
      break;
    case 'Invert':
      applyInvertFilter(data);
      break;
    case 'Blur':
      applyBlurFilter(data);
      break;
    case 'Brightness':
      applyBrightnessFilter(data, 50); // You can adjust the brightness value here
      break;
    case 'Saturation':
      applySaturationFilter(data, 2); // You can adjust the saturation value here
      break;
    case 'OilPainting':
      applyOilPaintingFilter(data);
      break;
    case 'Pixelate':
      applyPixelateFilter(data, 10); // You can adjust the pixelation value here
      break;
    case 'Emboss':
      applyEmbossFilter(data);
      break;
    // Add more filters here if you have implemented them
    default:
      break;
  }

  // After applying the filter, put the modified imageData back onto the canvas
  ctx.putImageData(imageData, 0, 0);
}

// Create buttons for different filters
const filters = ['Grayscale', 'Sepia', 'Invert', 'Blur', 'Brightness', 'Saturation', 'OilPainting', 'Pixelate', 'Emboss'];
filters.forEach(filter => {
  const button = document.createElement('button');
  button.textContent = filter;
  button.addEventListener('click', function() {
    applyFilter(filter);
  });
  filterButtons.appendChild(button);
});

// Grayscale Filter
function applyGrayscaleFilter(data) {
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // Red
    data[i + 1] = avg; // Green
    data[i + 2] = avg; // Blue
  }}

// Sepia Filter
function applySepiaFilter(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189); // Red
    data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168); // Green
    data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131); // Blue
  }}

// Invert Filter
function applyInvertFilter(data) {
 for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]; // Red
    data[i + 1] = 255 - data[i + 1]; // Green
    data[i + 2] = 255 - data[i + 2]; // Blue
  }}

// Blur Filter (Box Blur)
function applyBlurFilter(data) {
const blurRadius = 2; // You can adjust this value to control the blur strength

  const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = imageCanvas.width;
  tempCanvas.height = imageCanvas.height;
  tempCtx.putImageData(imageData, 0, 0);

  for (let y = 0; y < imageCanvas.height; y++) {
    for (let x = 0; x < imageCanvas.width; x++) {
      let r = 0, g = 0, b = 0, count = 0;

      for (let dy = -blurRadius; dy <= blurRadius; dy++) {
        for (let dx = -blurRadius; dx <= blurRadius; dx++) {
          const pixelData = tempCtx.getImageData(x + dx, y + dy, 1, 1).data;
          r += pixelData[0];
          g += pixelData[1];
          b += pixelData[2];
          count++;
        }
      }

      data[(y * imageCanvas.width + x) * 4] = r / count; // Red
      data[(y * imageCanvas.width + x) * 4 + 1] = g / count; // Green
      data[(y * imageCanvas.width + x) * 4 + 2] = b / count; // Blue
    }
  }}

// Brightness Adjustment Filter
function applyBrightnessFilter(data, brightness) {
for (let i = 0; i < data.length; i += 4) {
    data[i] += brightness; // Red
    data[i + 1] += brightness; // Green
    data[i + 2] += brightness; // Blue
  }}

// Saturation Adjustment Filter
function applySaturationFilter(data, saturation) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const avg = (r + g + b) / 3;
    data[i] = avg + saturation * (r - avg); // Red
    data[i + 1] = avg + saturation * (g - avg); // Green
    data[i + 2] = avg + saturation * (b - avg); // Blue
  }}

// Oil Painting Filter
// Oil Painting Filter
function applyOilPaintingFilter(data) {
  const width = imageCanvas.width;
  const height = imageCanvas.height;
  const intensity = 5; // You can adjust this value to control the oil painting effect

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4;
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];

      // Find the average intensity of the pixel
      const avg = (r + g + b) / 3;

      // Calculate the intensity index based on the average intensity
      const intensityIndex = Math.floor(avg / 255 * intensity);

      // Adjust the color of the pixel based on the intensity index
      data[pixelIndex] = intensityIndex / intensity * r; // Red
      data[pixelIndex + 1] = intensityIndex / intensity * g; // Green
      data[pixelIndex + 2] = intensityIndex / intensity * b; // Blue
    }
  }
}



// Pixelate Filter
// Pixelate Filter
function applyPixelateFilter(data, pixelSize) {
  for (let y = 0; y < imageCanvas.height; y += pixelSize) {
    for (let x = 0; x < imageCanvas.width; x += pixelSize) {
      const r = data[(y * imageCanvas.width + x) * 4];
      const g = data[(y * imageCanvas.width + x) * 4 + 1];
      const b = data[(y * imageCanvas.width + x) * 4 + 2];

      for (let dy = 0; dy < pixelSize; dy++) {
        for (let dx = 0; dx < pixelSize; dx++) {
          const i = ((y + dy) * imageCanvas.width + (x + dx)) * 4;
          data[i] = r; // Red
          data[i + 1] = g; // Green
          data[i + 2] = b; // Blue
        }
      }
    }
  }
}


// Emboss Filter
// Emboss Filter
function applyEmbossFilter(data) {
  for (let y = 0; y < imageCanvas.height; y++) {
    for (let x = 0; x < imageCanvas.width; x++) {
      const i = (y * imageCanvas.width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const prevI = ((y - 1) * imageCanvas.width + (x - 1)) * 4;
      const prevR = data[prevI];
      const prevG = data[prevI + 1];
      const prevB = data[prevI + 2];

      const diffR = r - prevR;
      const diffG = g - prevG;
      const diffB = b - prevB;

      const average = (diffR + diffG + diffB) / 3 + 128;

      data[i] = average; // Red
      data[i + 1] = average; // Green
      data[i + 2] = average; // Blue
    }
  }
}

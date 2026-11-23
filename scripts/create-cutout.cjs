const sharp = require('sharp');
const fs = require('fs');

async function processBottle() {
  const { data, info } = await sharp('public/assets/purefix-joint-oil-bottle.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  // Output RGBA buffer
  const out = Buffer.alloc(width * height * 4);

  // Mask array: 1 = background, 0 = bottle
  const mask = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);

  // Queue for BFS
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  function isBg(r, g, b) {
    // Background is near white (r >= 246, g >= 246, b >= 244 and low saturation)
    return r >= 245 && g >= 245 && b >= 243 && Math.abs(r - g) <= 5 && Math.abs(g - b) <= 5;
  }

  // Push border pixels
  for (let x = 0; x < width; x++) {
    // top row
    const iTop = x;
    const idxTop = x * channels;
    if (isBg(data[idxTop], data[idxTop+1], data[idxTop+2])) {
      visited[iTop] = 1;
      queue[tail++] = iTop;
    }
    // bottom row
    const iBot = (height - 1) * width + x;
    const idxBot = iBot * channels;
    if (isBg(data[idxBot], data[idxBot+1], data[idxBot+2])) {
      visited[iBot] = 1;
      queue[tail++] = iBot;
    }
  }

  for (let y = 0; y < height; y++) {
    // left col
    const iL = y * width;
    const idxL = iL * channels;
    if (isBg(data[idxL], data[idxL+1], data[idxL+2]) && !visited[iL]) {
      visited[iL] = 1;
      queue[tail++] = iL;
    }
    // right col
    const iR = y * width + (width - 1);
    const idxR = iR * channels;
    if (isBg(data[idxR], data[idxR+1], data[idxR+2]) && !visited[iR]) {
      visited[iR] = 1;
      queue[tail++] = iR;
    }
  }

  // BFS
  while (head < tail) {
    const curr = queue[head++];
    mask[curr] = 1; // It is verified background connected to boundary

    const cx = curr % width;
    const cy = Math.floor(curr / width);

    const neighbors = [
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1,
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1
    ];

    for (const n of neighbors) {
      if (n !== -1 && !visited[n]) {
        visited[n] = 1;
        const nIdx = n * channels;
        if (isBg(data[nIdx], data[nIdx+1], data[nIdx+2])) {
          queue[tail++] = n;
        }
      }
    }
  }

  // Feather/Smooth mask around edges
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const outIdx = (y * width + x) * 4;
      const mIdx = y * width + x;

      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];

      if (mask[mIdx] === 1) {
        // Pure background
        out[outIdx] = r;
        out[outIdx+1] = g;
        out[outIdx+2] = b;
        out[outIdx+3] = 0; // Transparent
      } else {
        // Bottle pixel - check if it borders background for antialiasing
        let bgNeighborCount = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              if (mask[ny * width + nx] === 1) bgNeighborCount++;
            }
          }
        }

        out[outIdx] = r;
        out[outIdx+1] = g;
        out[outIdx+2] = b;
        if (bgNeighborCount > 0) {
          // Antialias factor based on brightness
          const brightness = (r + g + b) / 3;
          if (brightness > 230) {
            out[outIdx+3] = Math.round(255 * (1 - (bgNeighborCount / 9) * 0.7));
          } else {
            out[outIdx+3] = 255;
          }
        } else {
          out[outIdx+3] = 255;
        }
      }
    }
  }

  await sharp(out, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .png({ compressionLevel: 9 })
  .toFile('public/assets/purefix-bottle-transparent.png');

  console.log('purefix-bottle-transparent.png created successfully!');
}

processBottle().catch(console.error);

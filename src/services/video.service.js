import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';
import { createCanvas, loadImage } from 'canvas';

/**
 * Extract frames from video buffer
 * @param {Buffer} videoBuffer - Input video buffer
 * @param {number} [fps=2] - Frames per second to extract
 * @returns {Promise<Array<Buffer>>} Array of frame buffers
 */
export const extractFrames = async (videoBuffer, fps = 2) => {
  return new Promise((resolve, reject) => {
    const frames = [];
    const canvas = createCanvas(640, 480);
    const ctx = canvas.getContext('2d');

    ffmpeg()
      .input(new PassThrough().end(videoBuffer))
      .inputFormat('mp4')
      .fps(fps)
      .outputOptions('-vf', 'scale=640:480')
      .on('error', reject)
      .on('end', () => resolve(frames))
      .pipe(
        new ffmpeg.Filter({
          filter: 'buffersink',
          options: { pix_fmt: 'rgb24' },
          ondata: async (chunk) => {
            try {
              const img = await loadImage(chunk);
              ctx.drawImage(img, 0, 0);
              frames.push(canvas.toBuffer('image/jpeg'));
            } catch (err) {
              console.error('Frame processing error:', err);
            }
          }
        })
      );
  });
};

/**
 * Convert video buffer to tensor-ready format
 * @param {Buffer} frame - Video frame buffer
 * @returns {tf.Tensor3D} Tensor representation
 */
export const frameToTensor = (frame) => {
  return tf.tidy(() => {
    const imageTensor = tf.node.decodeImage(frame, 3);
    return imageTensor.resizeBilinear([192, 192]).div(255.0);
  });
};

/**
 * Mock implementation for testing
 */
export const mockVideoProcessing = async () => {
  return [
    tf.randomNormal([192, 192, 3]),
    tf.randomNormal([192, 192, 3])
  ];
};
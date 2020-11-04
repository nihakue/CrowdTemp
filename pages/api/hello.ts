// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pureimage from 'pureimage';
import { PassThrough } from 'stream';

async function encodePNGToBuffer(canvas) {
  return encodeAndStreamIntoBuffer(pureimage.encodePNGToStream, canvas);
}

async function encodeJPEGToBuffer(canvas) {
  return encodeAndStreamIntoBuffer(pureimage.encodeJPEGToStream, canvas);
}

async function encodeAndStreamIntoBuffer(encodeDataToStream, canvas) {
  const passThroughStream = new PassThrough();
  const pngData = [];
  passThroughStream.on('data', chunk => pngData.push(chunk));
  passThroughStream.on('end', () => {});
  await encodeDataToStream(canvas, passThroughStream);
  return Buffer.concat(pngData);
}

export default async (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'image/png')
  const img = pureimage.make(100, 50);
  const ctx = img.getContext('2d');
  ctx.fillStyle = 'rgba(255,0,0, 0.5)';
  ctx.fillRect(0,0,100,100);
  const buffer = await encodePNGToBuffer(img);
  res.send(buffer);
}

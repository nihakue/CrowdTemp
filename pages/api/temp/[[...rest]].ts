// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import https from 'https';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export async function proxyAssetRequest(
  destinationUrl: string | URL,
  oreq: NextApiRequest,
  ores: NextApiResponse,
  options?: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    const proxy = https
      .request(destinationUrl, {
        method: 'POST',
        headers: {'Cache-Control': 'no-cache', 'Content-Type': 'application/json'}  
      }, function(res) {
        ores.writeHead(res.statusCode ?? 500, res.headers);
        res.pipe(ores, {
          end: true
        });
      })
      .on("end", resolve)
      .on("error", err => {
        ores.end();
        reject(err);
      })
      .on("abort", () => {
        ores.end();
        reject();
      });

    proxy.write(JSON.stringify({
      ...options
    }
    ));
    proxy.end();
  });
}

const handler: NextApiHandler = async (oreq, ores) => {
  const { rest = []} = oreq.query;
  const slug = rest[0] || "leith-theatres-big-radiator-generator";
  const theme = rest[1] || 'light';
  const size = rest[3] || 'default'
  const url = `https://crowd-temp.vercel.app/temp/${slug}/${theme}/static/${size}`;
  const doCrop = size !== 'default';
  const [ width, height ] = size.split('x');
  const clipOptions = doCrop ? {clip: {
    x: 0,
    y: 0,
    width: width,
    height: height,
  }} : {}
  const viewportOptions = doCrop ? {viewport: {
    width,
    height
  }} : {}
  const options = {
    url,
    ...viewportOptions,
    options: {
      type: "png",
      omitBackground: false,
      fullPage: !doCrop,
      ...clipOptions,
    }
  }
  ores.setHeader('Content-Type', 'image/png')
  ores.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=10');
  await proxyAssetRequest(`https://chrome.browserless.io/screenshot?token=${process.env.BROWSERLESS_TOKEN}`, oreq, ores, options);
}

export default handler;

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import https from 'https';
import { NextApiRequest, NextApiResponse } from 'next';

export async function proxyAssetRequest(
  destinationUrl: string | URL,
  oreq: NextApiRequest,
  ores: NextApiResponse
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
      url: "https://crowd-temp.vercel.app/temp/leith-theatres-big-radiator-generator/light/static",
      options: {
        fullPage: true,
        type: "png",
      }
    }));
    proxy.end();
  });
}

export default async (oreq, ores) => {
  ores.setHeader('Content-Type', 'image/png')
  await proxyAssetRequest('https://chrome.browserless.io/screenshot', oreq, ores);
}

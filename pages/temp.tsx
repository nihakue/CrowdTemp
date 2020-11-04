import { GetStaticProps } from 'next';
import React from 'react';
import cheerio from 'cheerio';
import { Thermometer } from '../components/therm';

// 4.881 top round

export default function Temp({current, target}) {
    return (
        <div>
            <h1>{`${current}/${target}`}</h1>
            <Thermometer />
        </div>
        )
}

function parseMoney(str) {
    return Number(str.replace(/[^0-9\.]/g, ''))
}

export const getStaticProps: GetStaticProps = async () => {
    const page = await fetch('https://www.crowdfunder.co.uk/we-say-no-to-no-deal');
    const body = await page.text();
    const $ = cheerio.load(body);
    const headers = $('h3').map((i, el) => $(el).text()).get();
    const current = headers.find(it => /^£[,0-9]+/.test(it));
    const maybeTarget = $('span').filter((i, el) =>/^£[,0-9]+ target/.test($(el).text())).map((i, el) => $(el).text()).get();
    
    return {
        props: {
            current: parseMoney(current),
            target: parseMoney(maybeTarget[0].split(' ')[0])
        },
        revalidate: 100
    }
}
import { GetStaticProps } from 'next';
import React from 'react';
import cheerio from 'cheerio';
import { Thermometer } from '../components/therm';

// 4.881 top round

function formatCurrencyLabey(amount) {
    return Intl.NumberFormat('en-uk', {style: 'currency', currency: 'GBP', notation: 'compact'}).format(Math.floor(amount));
}

export default function Temp({current, target}) {
    const milestones = [15000, 30000, 45000, target]
    const labels = milestones.map(formatCurrencyLabey).slice(0, -1)
    return (
        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <div style={{width: "75%"}}>
                <Thermometer progress={current / target} progressLabel={formatCurrencyLabey(current)} labels={labels} milestones={milestones.map(it => it / target)} />
            </div>
        </div>
        )
}

function parseMoney(str) {
    return Number(str.replace(/[^0-9\.]/g, ''))
}

export const getStaticProps: GetStaticProps = async () => {
    // const page = await fetch('https://www.crowdfunder.co.uk/we-say-no-to-no-deal');
    // const body = await page.text();
    // const $ = cheerio.load(body);
    // const headers = $('h3').map((i, el) => $(el).text()).get();
    // const current = headers.find(it => /^£[,0-9]+/.test(it));
    // const maybeTarget = $('span').filter((i, el) =>/^£[,0-9]+ target/.test($(el).text())).map((i, el) => $(el).text()).get();
    
    return {
        props: {
            // current: parseMoney(current),
            current: 0,
            target: 60000
            // target: parseMoney(maybeTarget[0].split(' ')[0])
        },
        revalidate: 100
    }
}
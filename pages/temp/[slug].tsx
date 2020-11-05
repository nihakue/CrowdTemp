import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import cheerio from 'cheerio';
import { Thermometer } from '../../components/therm';

function formatCurrencyLabey(amount) {
    return Intl.NumberFormat('en-uk', {style: 'currency', currency: 'GBP', notation: 'compact'}).format(Math.floor(amount));
}

export default function Temp({current, target}) {
    // const milestones = [15000, 30000, 45000, target]
    // const milestones = [10000, 50000, 100000, target];
    const milestones = Array(4).fill(0).map((it, i) => (i + 1) * (target/4))
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

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const page = await fetch(`https://www.crowdfunder.co.uk/${slug}`);
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

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import cheerio from 'cheerio';
import { Thermometer } from '../../../components/therm';
import {useSpring, animated, config} from 'react-spring'
import { formatCurrencyLabel } from '../../../components/utils';
import { Theme, getTheme } from '../../../components/theme';

function CrowdTherm({current, target, ...props}) {
    const progressLabel = formatCurrencyLabel(current)
    return <Thermometer progress={current / target} progressLabel={progressLabel} {...props}/>
}

const AnimatedCrowdTherm = animated(CrowdTherm)

export default function Temp({current, target, theme, isStatic, size}) {
    const milestones = [15000, 30000, 45000, target]
    const [width, height] = (!size || size === 'default') ? ['100%', '100%'] : size.split('x').map(it => `${it}px`);
    const animProps = useSpring({
        current,
        from: {
            current: 0
        },
        config: config.slow,
    });

    // const milestones = Array(4).fill(0).map((it, i) => (i + 1) * (target/4))
    const labels = milestones.map(formatCurrencyLabel).slice(0, -1)
    const Therm = isStatic ? CrowdTherm : AnimatedCrowdTherm;
    const curr = isStatic ? current : animProps.current;
    return (
        <Theme.Provider value={getTheme(theme)}>
            <div style={{width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '25px'}}>
                <div style={{width: "100%"}}>
                    <Therm current={curr} target={target} labels={labels} milestones={milestones.map(it => it / target)} />
                </div>
            </div>
        </Theme.Provider>
        )
}

function parseMoney(str) {
    return Number(str.replace(/[^0-9\.]/g, ''))
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug, rest = [] } = ctx.params;
    const page = await fetch(`https://www.crowdfunder.co.uk/${slug}`);
    const body = await page.text();
    const $ = cheerio.load(body);
    const headers = $('h3').map((i, el) => $(el).text()).get();
    const current = headers.find(it => /^£[,0-9]+/.test(it));
    const maybeTargetEls = $('span');
    const targetRegExp = /(£[,0-9]+) (stretch )?target/;
    const maybeTarget = maybeTargetEls.filter((i, el) =>targetRegExp.test($(el).text())).map((i, el) => $(el).text()).get()[0];
    const isLeith = slug === 'leith-theatres-big-radiator-generator';

    return {
        props: {
            theme: rest[0] || null,
            isStatic: !!rest[1],
            size: rest[2] || 'default',
            current: parseMoney(current),
            target: isLeith ? 60000 : parseMoney(maybeTarget.split(' ').find(part => part.startsWith('£')))
        },
        revalidate: 10
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}
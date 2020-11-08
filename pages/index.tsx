import Head from 'next/head';
import { useEffect } from 'react';

export default function Index() {
    useEffect(() => {
        if (window) {
            window.location.href="https://www.crowdfunder.co.uk/leith-theatres-big-radiator-generator";
        }
    }, [])
    return (
        <Head>
            <title></title>
            <meta property="og:title" content="Leith Theatre's Big Radiator Generator"></meta>
            <meta property="og:description" content="Help Leith Theatre protect its structure and its future whilst spreading warmth to its community this winter"></meta>
            <meta property="og:image" content="https://crowd-temp.vercel.app/api/temp"></meta>
            <meta property="og:image:width" content="300"></meta>
            <meta property="og:image:height" content="300"></meta>
            <meta property="og:url" content="https://www.crowdfunder.co.uk/leith-theatres-big-radiator-generator"></meta>
            <meta property="og:type" content="website"></meta>
            <meta name="twitter:card" content="summary_large_image"></meta>
        </Head>
    )
}
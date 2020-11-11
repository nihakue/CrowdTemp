import Head from 'next/head';
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';

export default function Index({rand}) {
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
            <meta property="og:image" content={`https://crowd-temp.vercel.app/api/temp/leith-theatres-big-radiator-generator/light/static/1146x600?${rand}`}></meta>
            <meta property="og:image:width" content="1146"></meta>
            <meta property="og:image:height" content="600"></meta>
            <meta property="og:url" content="https://www.crowdfunder.co.uk/leith-theatres-big-radiator-generator"></meta>
            <meta property="og:type" content="website"></meta>
            <meta name="twitter:card" content="summary_large_image"></meta>
        </Head>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {
            rand: Math.random().toString().split('.')[1]
        },
    }
}
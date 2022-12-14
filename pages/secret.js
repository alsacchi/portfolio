import Head from 'next/head'
import Layout from '../components/layout'
import CalcolaPrezzo from '../components/calcolaPrezzo';
import { getImageData } from '../lib/logos.js'

export default function Secret({ imageData }) {
    return (
        <Layout logoNames={imageData} notoverflow>
            <Head>
                <title>Pagina segretissima!</title>
            </Head>
            <CalcolaPrezzo></CalcolaPrezzo>
        </Layout>
    );
}

export async function getStaticProps() {
    const imageData = getImageData()
    return {
        props: {
            imageData
        }
    }
}



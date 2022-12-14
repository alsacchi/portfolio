import Head from 'next/head'
import Date from '../../components/date'
import Layout from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import { getAllPostIds, getPostData  } from '../../lib/posts'
import { getImageData } from '../../lib/logos.js'

export default function Post({ postData, imageData }) {
    return (
        <Layout logoNames={imageData} head={true}>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article className={utilStyles.card}>
                <h1 className={utilStyles.headingX1}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div className={utilStyles.overflow} dangerouslySetInnerHTML={{__html: postData.contentHtml}} />
            </article>
        </Layout>
    )
}

export async function getStaticPaths() {
    // Return a list of possible value for id  
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false
    } 
}

export async function getStaticProps({ params }) {
    // Fetch necessary data for the blog using params.id
    const postData = await getPostData(params.id)
    const imageData = getImageData()
    return {
        props: {
            postData,
            imageData
        }
    }
}
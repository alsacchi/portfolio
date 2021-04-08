import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import Layout, {siteTitle} from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import { getImageData } from '../lib/logos.js'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  const imageData = getImageData()
  return {
    props: {
      allPostsData,
      imageData
    }
  }
}

export default function Home({ allPostsData, imageData }) {
  return (
    <Layout home logoNames={imageData}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Sono un ragazzo di 18 anni, sviluppatore.
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
             <Link href={`/posts/${id}`}>
               <a>{title}</a>
             </Link>
             <br />
             <small className={utilStyles.lightText}>
               <Date dateString={date} />
             </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

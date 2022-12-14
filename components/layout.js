import Head from 'next/head'
import Image from 'next/image'
import Logo from '../components/logo'
import styles from './layout.module.css'
import logoStyles from './logo.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import andreaPhoto from '../public/images/profile.jpg'

const name = 'Andrea Sacchi'
export const siteTitle = 'Andrea\'s portfolio'

export default function Layout({ children, home, logoNames, head, notoverflow }) {
    return (
        <div className={styles.container}>
            <Head>
                <link rel="icon" href="/favicon.ico"/>
                <meta
                    name="description"
                    content="Andrea's portfolio"
                />
                <meta
                    property="og:image"
                    content={`https://og-image.vercel.app/${encodeURI(siteTitle)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_item" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <link rel="stylesheet" href="../css/prism-synthwave84.css" />
            </Head>
            <header className={styles.header}>
                {home ? (
                  <>
                    <Image
                      priority
                      src={andreaPhoto}
                      className={utilStyles.borderCircle}
                      height={144}
                      width={144}
                      alt={name}
                    />
                    <Link href="mailto:andrealorenzosacchi@gmail.com">
                      <h1 className={utilStyles.heading2Xl} >{name}</h1>
                    </Link>
                  </>
                ) : ( head ? (
                  <>
                    <Link href="/">
                      
                        <Image
                          priority
                          src="/images/profile.jpg"
                          className={utilStyles.borderCircle}
                          height={108}
                          width={108}
                          alt={name}
                        />
                      
                    </Link>
                    <h2 className={utilStyles.headingLg}>
                      <Link href="/">
                        <span className={utilStyles.colorInherit}>{name}</span>
                      </Link>
                    </h2>
                  </>
                ) : <></>)}
                <div className={styles.logoRow}>
                  {logoNames.data.map(({id, href}) => (
                    <Logo key={id} source={id} href={href}/>
                  ))}
                </div>
            </header>
            <main>{children}</main>
            {!home && (
              <div className={styles.backToHome}>
                <Link href="/">
                  ← Back to home
                </Link>
              </div>
            )}
        </div>
    )
}
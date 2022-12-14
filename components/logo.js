import Image from 'next/image'
import styles from './logo.module.css'
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css'

export default function Logo({source, href}) {
    return (
        <>
            <Link className={utilStyles.circularButton} href={href}>
                <Image className={styles.logo}
                  src={`/images/logos/${source}`}
                  height={32}
                  width={32}
                  alt={source}
                />
            </Link>
        </>
    )
}
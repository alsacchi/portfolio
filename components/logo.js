import Image from 'next/image'
import styles from './logo.module.css'
import utilStyles from '../styles/utils.module.css'

export default function Logo({source, href}) {
    return (
        <>
            <a className={utilStyles.circularButton} href={href}>
                <Image className={styles.logo}
                  src={`/images/logos/${source}`}
                  height={32}
                  width={32}
                  alt={source}
                />
            </a>
        </>
    )
}
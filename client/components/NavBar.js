import styles from '../styles/NavBar.module.css';

import {Rubik} from 'next/font/google';
const rubik = Rubik({
  weight: '400',
  subsets: ['latin']
});

import {Gaegu} from 'next/font/google';
const gaegu = Gaegu({
  weight: ['400', '700'],
  subsets: ['latin']
});

export default function NavBar(props) {
  return (
    <nav className={styles.navbar}>
      <div className={`${styles.container}`}>
        <a href="#" className={styles.logo}>
          <img src="/logo-nav.png" alt="Nomnom Logo"/>
        </a>
        <div className={`${styles.nav_links} ${rubik.className}`}>
          <div className={`${styles.btn} ${styles.nav_item} ${gaegu.className}`}>
            <a href="#buy">Buy $NOMNOM</a>
          </div>
          <div className={`${styles.nav_item}`}>
            <a href="https://twitter.com/nomnom_solana">
              <img src="/twitter.svg" alt="Nomnom - Twitter"/>
            </a>
          </div>
          <div className={`${styles.nav_item}`}>
            <a href="https://t.me/NomNom_on_Solana">
              <img src="/telegram.svg" alt="Nomnom - Telegram"/>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
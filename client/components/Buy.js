import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import buyStyles from '../styles/Buy.module.css';

import {Gaegu} from 'next/font/google';

const gaegu = Gaegu({
  weight: ['400', '700'],
  subsets: ['latin']
});

export default function Buy(props) {
  return (
    <div id={'buy'}>
      <h1>How To Buy</h1>
      <div className={styles.pill_container}>
        <div className={styles.pill}>
          <div className={styles.detail}>
            <a className={styles.link} href="https://jup.ag/swap/SOL-6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump">
              <img className={buyStyles.jup} src="/jupiter.svg" alt="Nomnom - Jupiter"/>
              <div>Buy on Jupiter</div>
            </a>
          </div>
        </div>
        <div className={styles.pill}>
          <div className={styles.detail}>
            <a className={styles.link} href="https://moonshot.money/nomnom?ref=iQDwsTbkZP">
              <img className={buyStyles.jup} src="/moonshot.png" alt="Nomnom - Moonshot"/>
              <div>Buy on Moonshot</div>
            </a>
          </div>
        </div>
        <div className={styles.pill}>
          <div className={styles.detail}>
            <a className={styles.link} href="https://app.prerich.com/solana/coin/6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump
">
              <img className={buyStyles.jup} src="/prerich.png" alt="Nomnom - PreRich"/>
              <div>Buy on PRERICH</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
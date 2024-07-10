import styles from '../styles/Home.module.css';

import NavBar from "@/components/NavBar";

import {Rubik} from 'next/font/google';
import {Bowlby_One} from 'next/font/google';
import {Itim} from 'next/font/google';
import {Jua} from 'next/font/google';
import {Gaegu} from 'next/font/google';

import { useEffect, useState } from 'react';

const rubik = Rubik({
  weight: '400',
  subsets: ['latin']
});

const bowlby = Bowlby_One({
  weight: '400',
  subsets: ['latin']
});

const itim = Itim({
  weight: '400',
  subsets: ['latin']
});

const jua = Jua({
  weight: '400',
  subsets: ['latin']
});

const gaegu = Gaegu({
  weight: ['400', '700'],
  subsets: ['latin']
});

export default function Home() {
  useEffect(() => {
    function setup() {

    }
    setup();
  }, []);

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.content_container}>
        <div className={`${styles.h_section_container} ${styles.landing_container}`}>
          <div className={styles.landing_info}>
            <img className={styles.landing_title} src="/landing-title.png" alt="Nomnom"/>
            <p className={`${styles.desc} ${gaegu.className}`}>
              nomnom is a hungry hamster that eats ALL the tings!
            </p>
            <p className={`${styles.ca_label} ${jua.className}`}>
              Contract Address
            </p>
            <div className={styles.ca_container}>
              <div>
                <span className={`${styles.ca} ${gaegu.className}`}>6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump</span>
              </div>
              <div className={styles.copy} onClick={() => {
                navigator.clipboard.writeText('6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump').then(() => {
                }).catch(err => {
                  console.error('Failed to copy to clipboard: ', err);
                });
              }}>
                <span className={`${gaegu.className}`}>Copy</span>
              </div>
            </div>
          </div>
          <div className={styles.landing}>
            <img src="/landing.png" alt="Nomnom"/>
          </div>
        </div>
      </div>
      {/* About */}
      <div className={`${styles.content_container} ${styles.bg_color2}`}>
        <div className={styles.section_container}>
          <div className={`${styles.about} ${gaegu.className} ${styles.h_section_container}`}>
            <img src="/eiffel.png" alt="Eiffel Tower Nomnom"/>
            <div>
              <h1>About $NOMNOM</h1>
              <p>
                nomnom is a hungry hamster on the Solana network.
                This hamster is SO hungry that any-ting is on the menu...<br/>
              </p>
              <div className={`${styles.btn} ${gaegu.className}`}>
                <a href="https://jup.ag/swap/6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump-SOL">Buy $NOMNOM</a>
              </div>
            </div>
          </div>
          <div className={styles.listings}>
            <a href="https://www.coingecko.com/en/coins/nomnom">
              <img src="/coingecko.svg" alt="Nomnom - CoinGecko"/>
            </a>
            <a href="https://dexscreener.com/solana/6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump">
              <img src="/dexscreener-circle.svg" alt="Nomnom - Dexscreener"/>
            </a>
            <a href="https://www.dextools.io/app/en/solana/pair-explorer/Fhmjp6SMtmD8GXkq8tw6aZjBk3sDpKtKKSH6RToLAX3m">
              <img src="/dextools.svg" alt="Nomnom - DexTools"/>
            </a>
          </div>
        </div>
      </div>
      {/* Meme/Avatar Maker */}
      <div className={styles.content_container}>
        <div className={`${styles.memes} ${gaegu.className} ${styles.h_section_container}`}>
          <img src="/meme-maker.png" alt="Nomnom Meme Maker"/>
          <div>
            <h1>Meme/Avatar Maker</h1>
            <p>
              Created by a talented community member, the tool can be used to easily create $NOMNOM memes and avatars!
            </p>
            <div className={`${styles.btn} ${gaegu.className}`}>
              <a href="https://nomnom-maker.vercel.app/">Meme Maker</a>
            </div>
          </div>
        </div>
      </div>
      {/* How To Buy / Tokenomics */}
      <div className={`${styles.content_container} ${styles.bg_color2} ${styles.last}`}>
        <div className={`${styles.token} ${styles.flex_column} ${gaegu.className}`}>
          <div>
            <h1>Tokenomics</h1>
            <div className={styles.pill_container}>
              <div className={styles.pill}>
                <div className={styles.header}>
                  Ticker
                </div>
                <div className={styles.detail}>
                  $NOMNOM
                </div>
              </div>
              <div className={styles.pill}>
                <div className={styles.header}>
                  Total Supply
                </div>
                <div className={styles.detail}>
                  1.000.000.000
                </div>
              </div>
              <div className={styles.pill}>
                <div className={styles.header}>
                  Liquidity
                </div>
                <div className={styles.detail}>
                  🔥
                </div>
              </div>
            </div>
          </div>
          <div>
            <h1>How To Buy</h1>
            <div className={styles.pill_container}>
              <div className={styles.pill}>
                <div className={styles.detail}>
                  Download Phantom
                </div>
              </div>
              <div className={styles.pill}>
                <div className={styles.detail}>
                  Buy or deposit Solana into your wallet.
                </div>
              </div>
              <div className={styles.pill}>
                <div className={styles.detail}>
                  Go to <a href="https://jup.ag/swap/6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump-SOL">Jupiter</a> and paste the $NOMNOM contract address.
                </div>
              </div>
            </div>
            {/* Join Our Community */}
            <div className={styles.socials_container}>
              <h1>Socials</h1>
              <p>Join the $NOMNOM Community</p>
              <div className={styles.socials}>
                <a href="https://twitter.com/nomnom_solana">
                  <img src="/twitter.svg" alt="Nomnom - Twitter"/>
                </a>
                <a href="https://t.me/NomNom_on_Solana">
                  <img src="/telegram.svg" alt="Nomnom - Telegram"/>
                </a>
                <a href="https://www.instagram.com/nomnom_solana">
                  <img src="/instagram.svg" alt="Nomnom - Instagram"/>
                </a>
                <a href="https://www.reddit.com/r/nomnom_solana/">
                  <img src="/reddit.svg" alt="Nomnom - Reddit"/>
                </a>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <img src="/feet.png" alt="Nomnom feet"/>
          </div>
        </div>
      </div>
    </div>
  );
}

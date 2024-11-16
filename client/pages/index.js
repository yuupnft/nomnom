import { useEffect, useState } from 'react';
import axios from 'axios';

import styles from '../styles/Home.module.css';

import NavBar from "@/components/NavBar";

import {Rubik} from 'next/font/google';
import {Bowlby_One} from 'next/font/google';
import {Itim} from 'next/font/google';
import {Jua} from 'next/font/google';
import {Gaegu} from 'next/font/google';

import Button from "@/components/Button";
import Buy from "@/components/Buy";

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

const baseUrl = 'https://nomnom-1u79.onrender.com/api/metadata';
//const baseUrl = 'http://localhost:3001/api/metadata';

export default function Home() {
  const [totalSupply, setTotalSupply] = useState('~999864338');

  useEffect(() => {
    function setup() {
      async function getData() {
        axios.get(baseUrl + '/totalsupply')
          .then((data) => {
            setTotalSupply(data.data);
          }, () => {
            console.error("Could not connect to API service.");
          });
      }
      getData();
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
            <img className={styles.eiffel} src="/eiffel.png" alt="Eiffel Tower Nomnom"/>
            <div>
              <h1>About $NOMNOM</h1>
              <p>
                nomnom is a hungry hamster on the Solana network.
                This hamster is SO hungry that any-ting is on the menu...<br/>
              </p>
              <Button name={"Buy $NOMNOM"} link={"#buy"} />
            </div>
          </div>
          <div className={styles.listings}>
            <a href="https://coinmarketcap.com/currencies/nomnom/">
              <img src="/cmc.svg" alt="Nomnom - CoinMarketCap"/>
            </a>
            <a href="https://www.coingecko.com/en/coins/nomnom">
              <img src="/coingecko.svg" alt="Nomnom - CoinGecko"/>
            </a>
            <a href="https://jup.ag/swap/SOL-6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump">
              <img src="/jupiter.svg" alt="Nomnom - Jupiter"/>
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
          <img src="/meme-maker2.png" alt="Nomnom Meme Maker"/>
          <div>
            <h1>Meme/Avatar Maker</h1>
            <p>
              Created by a talented community member, the tool can be used to easily create $NOMNOM memes and avatars!
            </p>
            {/*<Button name={"Try Now"} link={"/memes"} />*/}
            <Button name={"Try Now"} link={"https://nomnom-meme-maker.vercel.app/"} />
            <br/>
            <h1>Memes</h1>
            <p>
              View memes created by the community!
            </p>
            <Button name={"Meme Depot"} link={"https://memedepot.com/d/nom-nom"} />
          </div>
        </div>
      </div>
      {/* Nomnom Game */}
      <div className={`${styles.content_container} ${styles.bg_color2}`}>
        <div className={`${styles.media} ${gaegu.className} ${styles.h_section_container}`}>
          <img src="/nomnom-game.png" alt="Nomnom Game"/>
          <div>
            <h1>Nomnom The Game</h1>
            <p>
              The first game starring $NOMNOM, designed by a community member!
            </p>
            <Button name={"Play Nomnom"} link={"https://nomnomthegame.com/"}/>
          </div>
        </div>
      </div>
      {/* How To Buy / Tokenomics */}
      <div className={`${styles.content_container} ${styles.tokenomics}`}>
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
                  {totalSupply}
                </div>
              </div>
              <div className={styles.pill}>
                <div className={styles.header}>
                  Max Supply
                </div>
                <div className={styles.detail}>
                  1,000,000,000
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
        </div>
      </div>
      <div className={`${styles.content_container} ${styles.bg_color2} ${styles.last}`}>
        <div className={`${styles.token} ${styles.flex_column} ${gaegu.className}`}>
          <div>
            <Buy />
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

          <div className={styles.legal}>
            <p>
              Legal Disclaimer: $NOMNOM is a meme coin with no intrinsic value or expectation of financial return. $NOMNOM is for entertainment purposes only.
            </p>
            <div className={styles.contact}>
              <div>team@nomnomsol.com</div>
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

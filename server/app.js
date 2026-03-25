import cors from 'cors';
import express from 'express';
import axios from 'axios';
import { scheduler, job } from './scheduler.js';

// All available meme preset paths (served as Next.js static files)
// Categories: general (67), music (8), brands (10), cartoon (90), gang (18)
// bdsm category intentionally excluded by default
const MEME_PATHS = [
  ...Array.from({ length: 67 }, (_, i) => `/presets/general/${i}.png`),
  ...Array.from({ length: 8 }, (_, i) => `/presets/music/${i}.png`),
  ...Array.from({ length: 10 }, (_, i) => `/presets/brands/${i}.png`),
  ...Array.from({ length: 90 }, (_, i) => `/presets/cartoon/${i}.png`),
  ...Array.from({ length: 18 }, (_, i) => `/presets/gang/${i}.png`),
];

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;
const baseUrl = "https://api.coingecko.com/api/v3";
const contractAddress = '6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump';

async function setup() {
  // start server
  app.listen(port);

  // start ping web service scheduler
  scheduler.addSimpleIntervalJob(job);
}

await setup();

app.get("/api/ping", async (req, res) => {
  try {
    res.json({
      status: 'success'
    });
  } catch (e) {
    console.error(e);
    res.json({
      status: 'exception'
    });
  }
});

app.get("/api/metadata/totalsupply", async (req, res) => {
  try {
    axios.get(baseUrl + `/coins/solana/contract/${contractAddress}?x_cg_demo_api_key=${process.env.COIN_GECKO_API_KEY}`)
      .then((data) => {
        const d = data.data;
        if (d && d.hasOwnProperty('market_data') && d.market_data.hasOwnProperty('total_supply')) {
          res.send(d.market_data.total_supply.toString());
        } else {
          res.send('');
        }
      });
  } catch (e) {
    console.error(e);
    res.send('');
  }
});

app.get("/api/memes/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * MEME_PATHS.length);
  res.json({ url: MEME_PATHS[randomIndex] });
});

app.get("/api/metadata/circulatingsupply", async (req, res) => {
  try {
    axios.get(baseUrl + `/coins/solana/contract/${contractAddress}?x_cg_demo_api_key=${process.env.COIN_GECKO_API_KEY}`)
      .then((data) => {
        const d = data.data;
        if (d && d.hasOwnProperty('market_data') && d.market_data.hasOwnProperty('circulating_supply')) {
          res.send(d.market_data.circulating_supply.toString());
        } else {
          res.send('');
        }
      });
  } catch (e) {
    console.error(e);
    res.send('');
  }
});
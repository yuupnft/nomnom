import cors from 'cors';
import express from 'express';
import axios from 'axios';
import { scheduler, job } from './scheduler.js';

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
import cors from 'cors';
import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { scheduler, job } from './scheduler.js';
import { db } from './firebase.js';
import { cloudinary } from './cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const FEED_PATH = path.join(DATA_DIR, 'feed-counts.json');
const WALL_PATH = path.join(DATA_DIR, 'wall-submissions.json');

const VALID_FEED_ITEMS = [
  'pizza', 'donut', 'burger', 'hotdog', 'sushi', 'taco', 'sandwich', 'icecream',
  'cake', 'cookie', 'spaghetti', 'steak', 'cheese', 'apple', 'banana', 'watermelon',
  'croissant', 'ramen', 'sock', 'couch', 'lamp', 'chair', 'toilet', 'bathtub',
  'diamond', 'car', 'bicycle', 'phone', 'laptop', 'tv', 'book', 'guitar', 'clock',
  'umbrella', 'earth', 'moon', 'rocket', 'mountain', 'airplane', 'ship', 'train',
  'building', 'irs', 'homework', 'traffic', 'alarm', 'taxes', 'monday',
];

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

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

app.get("/api/tags", async (req, res) => {
  try {
    const tagsSnapshot = await db.collection("tags").get();
    res.json(tagsSnapshot.docs.map((doc) => doc.id));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to retrieve tags" });
  }
});

app.post("/api/memes/search", async (req, res) => {
  try {
    const { tags } = req.body;
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ error: "No tags were selected" });
    }
    const searchExpression = tags.map((tag) => `tags:${tag}`).join(" OR ");
    const result = await cloudinary.search
      .expression(searchExpression)
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();
    res.json(result.resources);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

app.get("/api/feed/counts", (req, res) => {
  try {
    const counts = readJSON(FEED_PATH);
    res.json(counts);
  } catch (e) {
    res.json({ pizza: 0, sock: 0, diamond: 0, car: 0, earth: 0 });
  }
});

app.post("/api/feed/:item", (req, res) => {
  const { item } = req.params;
  if (!VALID_FEED_ITEMS.includes(item)) {
    return res.status(400).json({ error: 'Invalid item' });
  }
  try {
    const counts = readJSON(FEED_PATH);
    counts[item] = (counts[item] || 0) + 1;
    writeJSON(FEED_PATH, counts);
    res.json({ item, count: counts[item] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update count' });
  }
});

app.get("/api/wall", (req, res) => {
  try {
    const submissions = readJSON(WALL_PATH);
    const sorted = submissions.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(sorted.slice(0, 100));
  } catch (e) {
    res.json([]);
  }
});

app.post("/api/wall", (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const trimmed = text.trim().slice(0, 120);
  try {
    const submissions = readJSON(WALL_PATH);
    const newEntry = {
      id: Date.now().toString(),
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    submissions.push(newEntry);
    writeJSON(WALL_PATH, submissions);
    res.json(newEntry);
  } catch (e) {
    res.status(500).json({ error: 'Failed to save submission' });
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
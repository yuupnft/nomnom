import axios from 'axios';
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const baseUrl = 'https://nomnom.onrender.com/api/ping';
//const baseUrl = 'http://localhost:3001/api/ping';

const scheduler = new ToadScheduler();
const task = new AsyncTask(
  "simple-task",
  () => {
    return axios.get(baseUrl)
      .then((data) => {
        console.log('Web Service Pinged');
        console.log(data.data);
      }, () => {
        console.error("Could not connect to API service to ping.");
      });
  },
  (err) => {
    console.error(err);
  }
);

const job = new SimpleIntervalJob({ minutes: 14, runImmediately: true}, task, {
  id: 'id_1',
  preventOverrun: true
});

export {scheduler, job};
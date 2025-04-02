import express from 'express';
import configRoutesFunction from './routes/index.js';

const app = express();
app.use(express.json());

configRoutesFunction(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });
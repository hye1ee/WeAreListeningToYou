import { Request, Response } from "express";
import { getEntities } from "./nlp";

const express = require('express');
export const app = express();
const cors = require('cors')({ origin: true });
app.use(cors);

app.get('/', (req: Request, res: Response) => {
  res.send(`
    <div>Hello! Server is </div>
  `);
});

app.post('/entities', async (req: Request, res: Response) => {
  const result = await getEntities(req.body.text)
  res.send(result);
});
import { Request, Response } from "express";
import { getEntities } from "./nlp";

const express = require('express');
export const app = express();
const cors = require('cors')({ origin: true });
app.use(cors);

const sample = `
  Hey, have you been following the news about how artificial intelligence is changing the job market?
  Yes, it's fascinating but also a bit concerning. Some jobs are at risk of automation, while new ones are being created. It's a big shift for a lot of industries.
  I agree. What do you think will happen to people whose jobs are automated?
  Well, I think there's going to be a lot of retraining and reskilling. Many companies are offering programs to help employees transition to new roles. It's still a major adjustment, though.
  True, and there's also the question of ethics. How do we ensure AI is used responsibly, without discriminating against certain groups?
  That's a big topic. Many companies are focusing on ethical AI and trying to build systems that are fair and transparent. Governments are also starting to regulate AI to ensure it's used in a way that's beneficial to society.
  It's good to hear that there's some oversight. I also think it's important to make sure AI doesn't widen the income gap. The benefits should be distributed more evenly.
  Definitely. I think we'll need a combination of corporate responsibility and public policy to make that happen. It's an exciting time, but there are lots of challenges to address.
`

app.get('/', (req: Request, res: Response) => {
  res.send(`
    <div>Hello! Server is </div>
  `);
});

app.get('/entities', async (req: Request, res: Response) => {
  const result = await getEntities(sample)
  res.send(result);
});
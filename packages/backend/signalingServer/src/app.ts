import express, { Request, Response } from 'express';

const app = express();

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

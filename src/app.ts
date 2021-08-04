import cors from 'cors';
import express, { json, text } from 'express';
import 'reflect-metadata';
import { loadRoutes } from './controllers';


const app = express();

app.use(cors());
app.use(json(), text());

loadRoutes(app);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`);
});

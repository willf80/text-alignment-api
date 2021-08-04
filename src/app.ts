import 'reflect-metadata';
import express from 'express';
import { loadRoutes } from './controllers';

const app = express();

loadRoutes(app);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`);
});

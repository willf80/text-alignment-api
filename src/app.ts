import cors from 'cors';
import express, { json, text } from 'express';
import 'reflect-metadata';
import Container from 'typedi';
import { loadRoutes } from './controllers';
import { AppDbContext } from './infrastructure/data-access/app-db-context';

const app = express();

app.use(cors());
app.use(json(), text());

const db = Container.get(AppDbContext);
db.context.sequelize.sync().then(() => {
  console.log('sync database done !');
});

loadRoutes(app);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`);
});

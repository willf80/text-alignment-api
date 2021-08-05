import 'reflect-metadata';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { json, NextFunction, Request, Response, text } from 'express';
import helmet from 'helmet';
import passport from 'passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import Container from 'typedi';
import { getReason, HttpStatusCode } from './common/http-status-code.constant';
import { loadRoutes } from './controllers';
import { AppDbContext } from './infrastructure/data-access/app-db-context';
const app = express();

dotenv.config();

app.use(cors());
app.use(helmet()); // sécurité
app.use(json(), text());

passport.initialize();

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new Strategy(options, (payload, done) => {
    try {
      done(null, payload);
    } catch (err) {
      done(err);
    }
  }),
);

const db = Container.get(AppDbContext);
db.context.sequelize.sync().then(() => {
  console.log('sync database done !');
});

loadRoutes(app);

app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
  const message = getReason(HttpStatusCode.INTERNAL_SERVER_ERROR);
  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message });
});

const PORT = process.env.APP_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`);
});

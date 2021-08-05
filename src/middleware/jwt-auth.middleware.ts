import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import Container from 'typedi';
import {
  HttpStatusCode,
  HttpStatusReason,
} from '../common/http-status-code.constant';
import { UserRepository } from '../infrastructure/repositories/user.repo';

export function jwtAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): unknown {
  return passport.authenticate(
    'jwt',
    { session: false },
    async (err, currentUser) => {
      if (err) return next(err);

      const result = {
        message: HttpStatusReason.get(HttpStatusCode.UNAUTHORIZED),
      };

      if (!currentUser?.email) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json(result);
      }

      const userRepo = Container.get(UserRepository);
      const user = await userRepo.findOne(currentUser.email);

      if (!user) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json(result);
      }

      req.user = currentUser;
      next();
    },
  )(req, res, next);
}

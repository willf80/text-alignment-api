import { Express } from 'express';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { jwtAuth } from '../middleware/jwt-auth.middleware';
import authController from './auth.controller';
import justifyController from './justify.controller';

/**
 * Charger toutes les routes du projet
 * @param app
 */
export function loadRoutes(app: Express): void {
  app.use('/api/auth', authController);
  app.use('/api/justify', jwtAuth, justifyController);

  const swaggerFile = process.cwd() + '/docs/swagger.json';
  const swaggerData = fs.readFileSync(swaggerFile, 'utf8');
  const swaggerDocument = JSON.parse(swaggerData);

  app.use(
    '/',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true }),
  );
}

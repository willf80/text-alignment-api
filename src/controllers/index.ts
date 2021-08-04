import { Express } from 'express';
import justifyController from './justify.controller';

/**
 * Charger toutes les routes du projet
 * @param app 
 */
export function loadRoutes(app: Express): void {
  app.use('/api/justify', justifyController);
}

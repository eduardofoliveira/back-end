import { Router } from 'express';

import DomainController from './app/controllers/DomainController';

const routes = new Router();

routes.get('/domains', DomainController.show);
routes.get('/domains/:id', DomainController.index);
routes.post('/domains', DomainController.store);
routes.put('/domains/:id', DomainController.update);
routes.delete('/domains/:id', DomainController.delete);

export default routes;

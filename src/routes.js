import { Router } from 'express';

import TicketController from './app/controllers/TicketController';
import SessionController from './app/controllers/SessionController';
import DomainController from './app/controllers/DomainController';
import UserController from './app/controllers/UserController';
import ContactController from './app/controllers/ContactController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/domains', DomainController.show);
routes.get('/domains/:id', DomainController.index);
routes.post('/domains', DomainController.store);
routes.put('/domains/:id', DomainController.update);
routes.delete('/domains/:id', DomainController.delete);

routes.get('/users/:domain', UserController.show);
routes.get('/users/:domain/:id', UserController.index);
routes.post('/users/:domain', UserController.store);
routes.put('/users/:domain/:id', UserController.update);
routes.delete('/users/:domain/:id', UserController.delete);

routes.get('/tickets', TicketController.show);
routes.get('/tickets/:id', TicketController.index);
routes.put('/tickets/:id', TicketController.update);

routes.get('/contacts', ContactController.show);
routes.get('/contacts/:id', ContactController.index);
routes.put('/contacts/:id', ContactController.update);
routes.post('/contacts', ContactController.store);
routes.delete('/contacts/:id', ContactController.delete);

export default routes;

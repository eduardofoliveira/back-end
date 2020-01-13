import { Router } from 'express';

import TicketController from './app/controllers/TicketController';
import SessionController from './app/controllers/SessionController';
import DomainController from './app/controllers/DomainController';
import UserController from './app/controllers/UserController';
import ContactController from './app/controllers/ContactController';
import ContactFieldController from './app/controllers/ContactFieldController';
import TemplateFieldsController from './app/controllers/TemplateFieldController';
import CallCenterController from './app/controllers/CallCenterController';

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
routes.get('/tickets/open', TicketController.showMyOpenTickets);
routes.get('/tickets/opens', TicketController.listOpensID);
routes.get('/tickets/:id', TicketController.index);
routes.put('/tickets/:id', TicketController.update);
routes.delete('/tickets/opens', TicketController.deleteAllOpenTickets);
routes.delete('/tickets/:id', TicketController.delete);

routes.get('/contacts', ContactController.show);
routes.get('/contacts/:id', ContactController.index);
routes.put('/contacts/:id', ContactController.update);
routes.post('/contacts', ContactController.store);
routes.delete('/contacts/:id', ContactController.delete);

routes.delete('/contactField/:id', ContactFieldController.delete);

routes.get('/templatefields/:id', TemplateFieldsController.show);
routes.post('/templatefields', TemplateFieldsController.store);
routes.delete('/templatefields/:id', TemplateFieldsController.delete);

routes.post('/callcenter/login', CallCenterController.login);
routes.post('/callcenter/logout', CallCenterController.logout);
routes.get('/callcenter/pausas', CallCenterController.pausas);
routes.post('/callcenter/pausa/entrar', CallCenterController.entrarPausa);
routes.post('/callcenter/pausa/sair', CallCenterController.SairPausa);

export default routes;

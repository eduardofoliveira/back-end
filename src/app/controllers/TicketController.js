import Sequelize from 'sequelize';
import Ticket from '../models/Ticket';
import User from '../models/User';
import Contact from '../models/Contact';

const { Op } = Sequelize;

class TicketController {
  async show(req, res) {
    const {
      visualizacao = 'todos',
      page = 0,
      visualizacaoUser = 'todos',
    } = req.query;
    let { proto, de, para } = req.query;
    let aberto;
    let fk_id_usuario;

    if (!de) {
      de = { [Op.like]: '%' };
    } else {
      de = { [Op.like]: `%${de}%` };
    }

    if (!para) {
      para = { [Op.like]: '%' };
    } else {
      para = { [Op.like]: `%${para}%` };
    }

    if (!proto) {
      proto = { [Op.like]: '%' };
    } else {
      proto = { [Op.like]: `%${proto}%` };
    }

    if (visualizacaoUser === 'todos') {
      fk_id_usuario = { [Op.like]: '%' };
    } else {
      fk_id_usuario = visualizacaoUser;
    }

    if (visualizacao === 'todos') {
      aberto = { [Op.gte]: 0 };
    } else if (visualizacao === 'abertos') {
      aberto = { [Op.eq]: 1 };
    } else if (visualizacao === 'fechados') {
      aberto = { [Op.eq]: 0 };
    } else if (visualizacao === 'pendentes') {
      aberto = { [Op.eq]: 3 };
    } else if (visualizacao === 'meus_tickets') {
      aberto = { [Op.gte]: 0 };
      fk_id_usuario = { [Op.eq]: req.user.id };
    } else {
      aberto = { [Op.gte]: 0 };
    }

    const user = await User.findByPk(req.user.id);
    const offset = parseInt(page * 50, 10);

    const tickets = await Ticket.findAndCountAll({
      where: {
        fk_id_dominio: user.fk_id_dominio,
        aberto,
        id: proto,
        de,
        para,
        fk_id_usuario,
      },
      include: [{ model: User, as: 'usuario', attributes: ['nome'] }],
      order: [['inicio', 'DESC']],
      limit: 50,
      offset,
    });

    res.json(tickets);
  }

  async index(req, res) {
    const { id } = req.params;

    const ticket = await Ticket.findOne({
      where: { id },
    });

    const de = await Contact.findOne({
      where: {
        did: ticket.de,
        fk_id_dominio: ticket.fk_id_dominio,
      },
      attributes: ['id', 'did', 'descricao'],
    });

    const para = await Contact.findOne({
      where: {
        did: ticket.para,
        fk_id_dominio: ticket.fk_id_dominio,
      },
      attributes: ['id', 'did', 'descricao'],
    });

    if (de) {
      ticket.de = de;
    }

    if (para) {
      ticket.para = para;
    }

    res.send(ticket);
  }

  async update(req, res) {
    const { id } = req.params;

    const ticket = await Ticket.findOne({
      where: { id, fk_id_dominio: req.user.id_dominio },
    });

    if (ticket) {
      const updatedTicket = await ticket.update(req.body);
      return res.status(202).json(updatedTicket);
    }
    return res.status(404).json({ error: 'Ticket não encontrado' });
  }
}

export default new TicketController();

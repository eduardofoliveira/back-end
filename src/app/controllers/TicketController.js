import Sequelize from 'sequelize';
import Ticket from '../models/Ticket';
import User from '../models/User';
import Contact from '../models/Contact';
import ContactFields from '../models/ContactFields';

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

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

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

    return res.send(ticket);
  }

  async update(req, res) {
    const { id } = req.params;

    const ticket = await Ticket.findOne({
      where: { id, fk_id_dominio: req.user.id_dominio },
    });

    if (req.body.aberto === 2 && !ticket.fk_fechado_por) {
      req.body.fk_fechado_por = req.user.id;
    }

    if (ticket) {
      const updatedTicket = await ticket.update(req.body);
      return res.status(202).json(updatedTicket);
    }
    return res.status(404).json({ error: 'Ticket não encontrado' });
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const ticket = await Ticket.findOne({
        where: {
          id,
          fk_id_dominio: req.user.id_dominio,
        },
      });

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket não encontrado' });
      }

      await ticket.destroy();
      return res.json({ message: 'Ticket deletado' });
    } catch (error) {
      return res.status(400).json({ error: 'Falha ao deletar Ticket' });
    }
  }

  async deleteAllOpenTickets(req, res) {
    try {
      await Ticket.destroy({
        where: {
          fk_id_usuario: req.user.id,
          fk_id_dominio: req.user.id_dominio,
          aberto: 1,
        },
      });

      return res.json({ message: 'Tickets abertos deletados' });
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'Falha ao deletar os Ticket abertos' });
    }
  }

  async listOpensID(req, res) {
    try {
      const tickets = await Ticket.findAll({
        where: {
          fk_id_usuario: req.user.id,
          fk_id_dominio: req.user.id_dominio,
          aberto: 1,
        },
        attributes: ['id'],
      });

      return res.json(tickets);
    } catch (error) {
      return res.status(400).json({ error: 'Falha ao buscar ID´s' });
    }
  }

  async showMyOpenTickets(req, res) {
    try {
      let tickets = await Ticket.findAll({
        where: {
          fk_id_usuario: req.user.id,
          fk_id_dominio: req.user.id_dominio,
          aberto: 1,
        },
      });

      tickets = tickets.map(async ticket => {
        const from = await Contact.findOne({
          where: {
            did: ticket.de,
            fk_id_dominio: ticket.fk_id_dominio,
          },
          attributes: ['id', 'did', 'descricao'],
          include: [ContactFields],
        });

        const to = await Contact.findOne({
          where: {
            did: ticket.para,
            fk_id_dominio: ticket.fk_id_dominio,
          },
          attributes: ['id', 'did', 'descricao', 'fraseologia'],
        });

        if (from) {
          ticket.de = from;
        }
        if (to) {
          ticket.para = to;
        }

        return ticket;
      });

      tickets = await Promise.all(tickets);

      tickets = tickets.map(ticket => {
        return {
          id: ticket.id,
          id_from: typeof ticket.de === 'string' ? null : ticket.de.id,
          from: typeof ticket.de === 'string' ? ticket.de : ticket.de.did,
          fromComment: typeof ticket.de === 'string' ? '' : ticket.de.descricao,
          to: typeof ticket.para === 'string' ? ticket.para : ticket.para.did,
          toComment:
            typeof ticket.para === 'string' ? '' : ticket.para.descricao,
          script:
            typeof ticket.para === 'string' ? '' : ticket.para.fraseologia,
          callid: ticket.call_id,
          detalhes:
            typeof ticket.de === 'string' ? [] : ticket.de.ContactFields,
          historico: [],
        };
      });

      return res.json(tickets);
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'Falha ao buscar meus Tickets abertos' });
    }
  }
}

export default new TicketController();

import Sequelize from 'sequelize';
import Ticket from '../models/Ticket';
import User from '../models/User';

const { Op } = Sequelize;

class TicketController {
  async show(req, res) {
    const { visualizacao = 'todos', page = 0 } = req.query;
    let aberto;

    if (visualizacao === 'todos') {
      aberto = { [Op.gte]: 0 };
    } else if (visualizacao === 'abertos') {
      aberto = { [Op.eq]: 1 };
    } else if (visualizacao === 'fechados') {
      aberto = { [Op.eq]: 0 };
    }

    const user = await User.findByPk(req.user.id);
    const offset = parseInt(page * 50, 10);

    const tickets = await Ticket.findAndCountAll({
      where: { fk_id_dominio: user.fk_id_dominio, aberto },
      include: [{ model: User, as: 'usuario', attributes: ['nome'] }],
      order: [['inicio', 'DESC']],
      limit: 50,
      offset,
    });

    res.json(tickets);
  }
}

export default new TicketController();

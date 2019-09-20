import Ticket from '../models/Ticket';
import User from '../models/User';

class TicketController {
  async show(req, res) {
    const user = await User.findByPk(req.user.id);
    const tickets = await Ticket.findAndCountAll({
      where: { fk_id_dominio: user.fk_id_dominio },
      order: [['inicio', 'DESC']],
      limit: 50,
      offset: 50,
    });

    res.json(tickets);
  }
}

export default new TicketController();

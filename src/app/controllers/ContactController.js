import Contact from '../models/Contact';
import ContactFields from '../models/ContactFields';

class ContactController {
  async show(req, res) {
    const contacts = await Contact.findAll({
      where: {
        fk_id_dominio: req.user.id_dominio,
      },
      include: [ContactFields],
    });

    res.json(contacts);
  }
}

export default new ContactController();

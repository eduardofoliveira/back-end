import ContactFields from '../models/ContactFields';

class ContactFieldController {
  async delete(req, res) {
    try {
      const { id } = req.params;
      const contactField = await ContactFields.findByPk(id);

      if (contactField) {
        await contactField.destroy();
      }

      return res.json({ message: 'Contato Removido' });
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'Erro ao deletar campo de contato' });
    }
  }
}

export default new ContactFieldController();

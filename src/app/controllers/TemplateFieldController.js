import TemplateFields from '../models/TemplateFields';

class TemplateFieldController {
  async show(req, res) {
    try {
      const { id } = req.params;
      const contactField = await TemplateFields.findAll({
        where: {
          fk_id_dominio: id,
        },
      });

      if (!contactField) {
        res.status(404).json({ error: 'Campos não encontrados' });
      }

      res.json(contactField);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao buscar campos padrão' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const contactField = await TemplateFields.findByPk(id);

      if (!contactField) {
        res.status(404).json({ error: 'Campo não encontrados' });
      }

      await contactField.destroy();

      res.json({ message: `Campo ${contactField.nome_campo} deletado` });
    } catch (error) {
      res.status(400).json({ error: 'Erro ao deletar campo do template' });
    }
  }
}

export default new TemplateFieldController();

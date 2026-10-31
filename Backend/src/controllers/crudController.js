import prisma from '../config/prisma.js';

// Shared CRUD handlers. Async errors propagate to the central error handler
// (Express 5 forwards rejected promises), so there is no per-handler try/catch.
const createCrudController = ({ model, orderBy, beforeSave }) => {
  const delegate = () => prisma[model];
  const prepare = (data) => (beforeSave ? beforeSave(data) : data);

  return {
    list: async (req, res) => {
      res.status(200).json(await delegate().findMany({ orderBy }));
    },
    create: async (req, res) => {
      const record = await delegate().create({ data: prepare(req.body) });
      res.status(201).json(record);
    },
    update: async (req, res) => {
      const record = await delegate().update({ where: { id: req.params.id }, data: prepare(req.body) });
      res.status(200).json(record);
    },
    remove: async (req, res) => {
      await delegate().delete({ where: { id: req.params.id } });
      res.status(204).send();
    },
  };
};

export default createCrudController;

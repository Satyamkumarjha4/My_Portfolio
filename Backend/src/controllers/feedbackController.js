import createCrudController from './crudController.js';

const crud = createCrudController({
  model: 'feedback',
  orderBy: { createdAt: 'desc' },
  beforeSave: (data) => ({ ...data, remark: data.remark || null }),
});

export default crud;

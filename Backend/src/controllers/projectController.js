import createCrudController from './crudController.js';

export default createCrudController({
  model: 'project',
  orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
});

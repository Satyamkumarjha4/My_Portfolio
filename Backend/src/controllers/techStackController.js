import createCrudController from './crudController.js';

export default createCrudController({
  model: 'techStack',
  orderBy: [{ category: 'asc' }, { name: 'asc' }],
});

import createCrudController from './crudController.js';

export default createCrudController({
  model: 'achievement',
  orderBy: { date: 'desc' },
});

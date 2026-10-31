import createCrudController from './crudController.js';
import { deriveStartDate } from '../utils/schemas.js';

export default createCrudController({
  model: 'timelineItem',
  orderBy: [{ startDate: { sort: 'desc', nulls: 'last' } }, { title: 'asc' }],
  beforeSave: (data) => {
    // Keep a sortable date in sync with the human-readable label.
    if (data.date && data.startDate === undefined) {
      return { ...data, startDate: deriveStartDate(data.date) };
    }
    return data;
  },
});

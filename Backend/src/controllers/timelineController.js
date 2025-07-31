import prisma from '../config/prisma.js';

const validTypes = ['EDUCATION', 'HACKATHON', 'WORK'];

const validateTimelineItem = (data, isCreate = false) => {
  const errors = [];
  
  if (isCreate && !data.title) errors.push('Title is required');
  if (isCreate && !data.date) errors.push('Date is required');
  if (isCreate && !data.description) errors.push('Description is required');
  if (isCreate && !data.type) errors.push('Type is required');
  
  if (data.title && typeof data.title !== 'string') errors.push('Title must be a string');
  if (data.date && typeof data.date !== 'string') errors.push('Date must be a string');
  if (data.description && typeof data.description !== 'string') errors.push('Description must be a string');
  if (data.remarks && typeof data.remarks !== 'string') errors.push('Remarks must be a string');
  
  if (data.type && !validTypes.includes(data.type)) {
    errors.push(`Invalid type. Valid values: ${validTypes.join(', ')}`);
  }
  
  return errors;
};

export const getTimelineItems = async (req, res) => {
  try {
    const timelineItems = await prisma.timelineItem.findMany();
    res.status(200).json(timelineItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timeline items' });
  }
};

export const createTimelineItem = async (req, res) => {
  const errors = validateTimelineItem(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }
  
  try {
    const timelineItem = await prisma.timelineItem.create({ 
      data: req.body 
    });
    res.status(201).json(timelineItem);
  } catch (error) {
    res.status(400).json({ error: 'Timeline item creation failed' });
  }
};

export const updateTimelineItem = async (req, res) => {
  const { id } = req.params;
  const errors = validateTimelineItem(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }
  
  try {
    const timelineItem = await prisma.timelineItem.update({
      where: { id },
      data: req.body
    });
    res.status(200).json(timelineItem);
  } catch (error) {
    res.status(400).json({ error: 'Timeline item update failed' });
  }
};

export const deleteTimelineItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.timelineItem.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Timeline item deletion failed' });
  }
};
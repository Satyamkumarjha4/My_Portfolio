import prisma from '../config/prisma.js';

const validateFeedback = (data, isCreate = false) => {
  const errors = [];
  
  if (isCreate && !data.email) errors.push('Email is required');
  if (isCreate && !data.name) errors.push('Name is required');
  if (isCreate && !data.rating) errors.push('Rating is required');
  
  if (data.email && typeof data.email !== 'string') errors.push('Email must be a string');
  if (data.name && typeof data.name !== 'string') errors.push('Name must be a string');
  if (data.remark && typeof data.remark !== 'string') errors.push('Remark must be a string');
  
  if (data.rating) {
    const rating = Number(data.rating);
    if (isNaN(rating)) errors.push('Rating must be a number');
    else if (rating < 1 || rating > 5) errors.push('Rating must be between 1 and 5');
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  return errors;
};

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};

export const createFeedback = async (req, res) => {
  const errors = validateFeedback(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }
  
  try {
    const feedback = await prisma.feedback.create({ 
      data: { 
        ...req.body,
        rating: Number(req.body.rating),
        createdAt: new Date() 
      }
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: 'Feedback submission failed' });
  }
};

export const deleteFeedback = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.feedback.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Feedback deletion failed' });
  }
};
import prisma from '../config/prisma.js';

const validateAchievement = (data, isCreate = false) => {
  const errors = [];
  
  if (isCreate && !data.title) errors.push('Title is required');
  if (isCreate && !data.date) errors.push('Date is required');
  if (isCreate && !data.overview) errors.push('Overview is required');
  
  if (data.title && typeof data.title !== 'string') errors.push('Title must be a string');
  if (data.overview && typeof data.overview !== 'string') errors.push('Overview must be a string');
  if (data.certificate && typeof data.certificate !== 'string') errors.push('Certificate must be a string');
  
  if (data.date) {
    const date = new Date(data.date);
    if (isNaN(date.getTime())) errors.push('Invalid date format');
  }
  
  return errors;
};

export const getAchievements = async (req, res) => {
  try {
    const achievements = await prisma.achievement.findMany();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
};

export const createAchievement = async (req, res) => {
  const errors = validateAchievement(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }
  
  try {
    const achievement = await prisma.achievement.create({ 
      data: {
        ...req.body,
        date: new Date(req.body.date)
      }
    });
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ error: 'Achievement creation failed' });
  }
};

export const updateAchievement = async (req, res) => {
  const { id } = req.params;
  const errors = validateAchievement(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }
  
  try {
    const updateData = {...req.body};
    if (req.body.date) updateData.date = new Date(req.body.date);
    
    const achievement = await prisma.achievement.update({
      where: { id },
      data: updateData
    });
    res.status(200).json(achievement);
  } catch (error) {
    res.status(400).json({ error: 'Achievement update failed' });
  }
};

export const deleteAchievement = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.achievement.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Achievement deletion failed' });
  }
};
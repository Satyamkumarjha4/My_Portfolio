import prisma from '../config/prisma.js';

const validCategories = [
  'Languages', 
  'Frontend', 
  'Python_Frameworks', 
  'Databases', 
  'Data_Science', 
  'Tools'
];

const validateTechStack = (data, isCreate = false) => {
  const errors = [];
  
  if (isCreate && !data.name) errors.push('Name is required');
  if (isCreate && !data.category) errors.push('Category is required');
  if (isCreate && !data.proficiency) errors.push('Proficiency is required');
  if (isCreate && !data.description) errors.push('Description is required');
  if (isCreate && !data.iconName) errors.push('Icon name is required');
  
  if (data.name && typeof data.name !== 'string') errors.push('Name must be a string');
  if (data.description && typeof data.description !== 'string') errors.push('Description must be a string');
  if (data.iconName && typeof data.iconName !== 'string') errors.push('Icon name must be a string');
  
  if (data.category && !validCategories.includes(data.category)) {
    errors.push(`Invalid category. Valid values: ${validCategories.join(', ')}`);
  }
  
  if (data.proficiency) {
    const proficiency = Number(data.proficiency);
    if (isNaN(proficiency)) errors.push('Proficiency must be a number');
    else if (proficiency < 1 || proficiency > 100) errors.push('Proficiency must be between 1 and 100');
  }
  
  return errors;
};

export const getTechStacks = async (req, res) => {
  try {
    const techStacks = await prisma.techStack.findMany();
    res.status(200).json(techStacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tech stacks' });
  }
};

export const createTechStack = async (req, res) => {
  const errors = validateTechStack(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }
  
  try {
    const techStack = await prisma.techStack.create({ 
      data: {
        ...req.body,
        proficiency: Number(req.body.proficiency)
      }
    });
    res.status(201).json(techStack);
  } catch (error) {
    res.status(400).json({ error: 'Tech stack creation failed' });
  }
};

export const updateTechStack = async (req, res) => {
  const { id } = req.params;
  const errors = validateTechStack(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }
  
  try {
    const updateData = {...req.body};
    if (req.body.proficiency) {
      updateData.proficiency = Number(req.body.proficiency);
    }
    
    const techStack = await prisma.techStack.update({
      where: { id },
      data: updateData
    });
    res.status(200).json(techStack);
  } catch (error) {
    res.status(400).json({ error: 'Tech stack update failed' });
  }
};

export const deleteTechStack = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.techStack.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Tech stack deletion failed' });
  }
};
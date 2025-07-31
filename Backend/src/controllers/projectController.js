import prisma from '../config/prisma.js';

const validateProject = (data, isCreate = false) => {
  const errors = [];
  
  if (isCreate && !data.title) errors.push('Title is required');
  if (isCreate && !data.description) errors.push('Description is required');
  if (isCreate && !data.techStack) errors.push('TechStack is required');
  if (isCreate && !data.tags) errors.push('Tags is required');
  if (isCreate && !data.imageUrl) errors.push('Image URL is required');
  if (isCreate && !data.githubUrl) errors.push('GitHub URL is required');
  if (isCreate && !data.demoUrl) errors.push('Demo URL is required');
  
  if (data.title && typeof data.title !== 'string') errors.push('Title must be a string');
  if (data.description && typeof data.description !== 'string') errors.push('Description must be a string');
  if (data.imageUrl && typeof data.imageUrl !== 'string') errors.push('Image URL must be a string');
  if (data.githubUrl && typeof data.githubUrl !== 'string') errors.push('GitHub URL must be a string');
  if (data.demoUrl && typeof data.demoUrl !== 'string') errors.push('Demo URL must be a string');
  
  if (data.techStack) {
    if (!Array.isArray(data.techStack)) errors.push('TechStack must be an array');
    else if (data.techStack.some(item => typeof item !== 'string')) {
      errors.push('TechStack must contain only strings');
    }
  }
  
  if (data.tags) {
    if (!Array.isArray(data.tags)) errors.push('Tags must be an array');
    else if (data.tags.some(item => typeof item !== 'string')) {
      errors.push('Tags must contain only strings');
    }
  }
  
  if (data.imageOnRight && typeof data.imageOnRight !== 'boolean') {
    errors.push('imageOnRight must be a boolean');
  }
  
  return errors;
};

export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const createProject = async (req, res) => {
  const errors = validateProject(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }
  
  try {
    const project = await prisma.project.create({ 
      data: {
        ...req.body,
        techStack: req.body.techStack || [],
        tags: req.body.tags || []
      }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: 'Project creation failed', details: error.message });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const errors = validateProject(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }
  
  try {
    const project = await prisma.project.update({
      where: { id },
      data: req.body
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: 'Project update failed', details: error.message });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Project deletion failed', details: error.message });
  }
};
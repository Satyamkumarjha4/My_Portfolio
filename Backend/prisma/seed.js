// Local/dev sample data. Safe to re-run: a table is only seeded when it is empty.
// Usage: npx prisma db seed
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedIfEmpty = async (name, model, rows) => {
  if ((await model.count()) > 0) return console.log(`skip ${name} (not empty)`);
  await model.createMany({ data: rows });
  console.log(`seeded ${rows.length} ${name}`);
};

await seedIfEmpty('projects', prisma.project, [
  {
    title: 'Car Price Prediction Web App',
    description: 'Predicts used car prices using ensemble models and CatBoost, served by a Flask backend.',
    techStack: ['Flask', 'Python', 'CatBoost', 'Pandas', 'Scikit-learn'],
    tags: ['ML', 'Web'],
    imageUrl: '/project_images/car_prediction.png',
    githubUrl: 'https://github.com/Satyamkumarjha4',
    demoUrl: 'https://github.com/Satyamkumarjha4',
    imageOnRight: false,
    sortOrder: 1,
  },
  {
    title: 'Movie Buddy - Recommendation Engine',
    description: 'Movie recommender using NLP and cosine similarity for personalised suggestions.',
    techStack: ['Streamlit', 'Pandas', 'Scikit-learn', 'NLTK'],
    tags: ['ML', 'NLP'],
    imageUrl: '/project_images/movie_recomendation_system.png',
    githubUrl: 'https://github.com/Satyamkumarjha4',
    demoUrl: 'https://github.com/Satyamkumarjha4',
    imageOnRight: true,
    sortOrder: 2,
  },
  {
    title: 'Binge+ - Movie & Web Series Explorer',
    description: 'Content discovery platform with filtering, search and metadata stored in MongoDB.',
    techStack: ['JavaScript', 'MongoDB', 'Express.js', 'Node.js'],
    tags: ['Full-stack'],
    imageUrl: '/project_images/Binge.png',
    githubUrl: 'https://github.com/Satyamkumarjha4',
    demoUrl: 'https://github.com/Satyamkumarjha4',
    imageOnRight: false,
    sortOrder: 3,
  },
]);

await seedIfEmpty('tech stacks', prisma.techStack, [
  { name: 'Python', category: 'Languages', proficiency: 90, description: 'Primary language for ML and backend scripting', iconName: 'FaPython' },
  { name: 'React', category: 'Frontend', proficiency: 85, description: 'Component-based UIs with hooks', iconName: 'FaReact' },
  { name: 'PostgreSQL', category: 'Databases', proficiency: 75, description: 'Relational modelling and SQL', iconName: 'BiLogoPostgresql' },
]);

await seedIfEmpty('timeline items', prisma.timelineItem, [
  { title: 'B.Tech Computer Science', date: '2022 - 2026', description: 'Specialising in AI/ML and full-stack development.', type: 'EDUCATION', startDate: new Date('2022-01-01') },
]);

await seedIfEmpty('achievements', prisma.achievement, [
  { title: 'Sample certificate', date: new Date('2024-01-01'), overview: 'Replace with a real achievement.', certificate: null },
]);

await prisma.$disconnect();

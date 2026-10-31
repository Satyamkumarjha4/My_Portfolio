// Parses req.body with a zod schema. Unknown keys are stripped, which is what
// prevents mass assignment into Prisma. `partial` is used for updates.
const validate = (schema, { partial = false } = {}) => (req, res, next) => {
  const s = partial ? schema.partial() : schema;
  const result = s.safeParse(req.body ?? {});
  if (!result.success) return next(result.error);
  if (partial && Object.keys(result.data).length === 0) {
    return res.status(400).json({ error: 'No updatable fields provided' });
  }
  req.body = result.data;
  next();
};

export default validate;

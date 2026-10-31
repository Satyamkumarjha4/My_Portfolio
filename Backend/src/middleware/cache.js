// Public content changes rarely: let browsers/CDNs reuse it briefly and
// serve stale while revalidating. Worst case an admin edit shows up ~1 min later
// (the admin client sends Cache-Control: no-cache, so it always sees fresh data).
export const publicCache = (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  next();
};

export const noStore = (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
};

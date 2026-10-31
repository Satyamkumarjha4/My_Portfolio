// The one place the default site URL lives. Override with VITE_SITE_URL
// (e.g. when a custom domain is added); everything else derives from it.
export const DEFAULT_SITE_URL = 'https://satyamportfolio-seven.vercel.app';

export const resolveSiteUrl = (value) => (value && value.trim() ? value.trim() : DEFAULT_SITE_URL).replace(/\/+$/, '');

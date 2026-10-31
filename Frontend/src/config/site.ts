// Single source of truth for contact details, social links and the site URL.
// The site URL comes from VITE_SITE_URL (see vite.config.ts); index.html, the
// sitemap and robots.txt are built from the same value.
export const site = {
  name: "Satyam Kumar Jha",
  url: import.meta.env.VITE_SITE_URL,
  email: "satyamjha4@gmail.com",
  phone: {
    display: "+91 76830 95499",
    tel: "+917683095499",
  },
  github: {
    handle: "Satyamkumarjha4",
    url: "https://github.com/Satyamkumarjha4",
    repoUrl: "https://github.com/Satyamkumarjha4/My_Portfolio",
  },
  linkedin: {
    handle: "satyamkumarjha4",
    url: "https://www.linkedin.com/in/satyamkumarjha4",
  },
  resumeUrl: "https://drive.google.com/file/d/1tQ9_ap-tw5Et5qku7h7328wDLC3Bg8I8/view?usp=sharing",
} as const

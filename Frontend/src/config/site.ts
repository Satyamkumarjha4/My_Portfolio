// Single source of truth for contact details, social links and the site URL.
// Static files that cannot import this (index.html, public/robots.txt,
// public/sitemap.xml) repeat the site URL and must be updated together with it.
export const site = {
  name: "Satyam Kumar Jha",
  url: "https://satyamportfolio-seven.vercel.app",
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

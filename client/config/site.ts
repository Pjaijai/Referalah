export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Referalah",
  description: "海外港人搵Referral平台。",
  page: {
    main: {
      name: "main",
      href: "/",
    },
    profile: {
      name: "用戶檔案",
      href: "/profile",
    },
    auth: {
      name: "auth",
      href: "/auth",
    },
    referrer: {
      name: "推薦人",
      href: "/referer",
    },
    referee: {
      name: "受薦人",
      href: "/referee",
    },
    createPost: {
      name: "貼街招",
      href: "/post/create",
    },
    referrerPost: {
      name: "工搵人",
      href: "/post/referer",
    },
    refereePost: {
      name: "人搵工",
      href: "/post/referee",
    },
    about: {
      name: "about",
      href: "/about",
    },
    privacyPolicy: {
      name: "privatePolicy",
      href: "/privacy-policy",
    },
    termsAndConditions: {
      name: "termsAndConditions",
      href: "/terms-and-conditions",
    },
    contributors: {
      name: "貢獻者",
      href: "/contributors",
    },
  },
  links: {
    instagram: "https://instagram.com/referalah?igshid=NGVhN2U2NjQ0Yg==",
    github: "https://github.com/Pjaijai/Referalah",
  },
}

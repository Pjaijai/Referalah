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
    editPost: {
      name: "編輯街招",
      href: "/post/edit",
    },
    referrerPost: {
      name: "街招",
      href: "/post/referer",
    },
    about: {
      name: "關於本平台",
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
      name: "貢獻者名單",
      href: "/contributors",
    },
  },
  links: {
    instagram: "https://instagram.com/referalah?igshid=NGVhN2U2NjQ0Yg==",
    github: "https://github.com/Pjaijai/Referalah",
  },
}

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
      name: "profile",
      href: "/profile",
    },
    auth: {
      name: "auth",
      href: "/auth",
    },
    referrer: {
      name: "referrer",
      href: "/referer",
    },
    referee: {
      name: "referee",
      href: "/referee",
    },
    createPost: {
      name: "createPost",
      href: "/post/create",
    },
    referrerPost: {
      name: "createPost",
      href: "/post/referer",
    },
    refereePost: {
      name: "createPost",
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
  },
  links: {
    instagram: "https://instagram.com/referalah?igshid=NGVhN2U2NjQ0Yg==",
    github: "https://github.com/Pjaijai/Referalah",
  },
}

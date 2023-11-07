export type SiteConfig = typeof siteConfig

const METADATA_DEFAULT_DESCRIPTION =
  "海外港人搵Referral平台。 A job referral platform for overseas Hongkongers. Connect, refer and get referred to support the Hong Kong community across the globe."

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
      metadata: {
        title: "登入 / 註冊 Sign In / Sign Up",
        description:
          "透過魔術連結登入或註冊。無須密碼。 Sign in or sign up with magic link. Password is not required.",
      },
    },
    referrer: {
      name: "推薦人",
      href: "/referer",
      metadata: {
        title: "推薦人 Referrers",
        description:
          "想搵人推薦你入去？係到搵下啦！ Meet someone to bring you closer to your dream company!",
      },
    },
    referee: {
      name: "受薦人",
      href: "/referee",
      metadata: {
        title: "受薦人 Referees",
        description:
          "想搵人材？係到睇下有冇合適嘅人啦！ Recommend an amazing talent from Hong Kong to join your company!",
      },
    },
    createPost: {
      name: "貼街招",
      href: "/post/create",
      metadata: {
        title: "貼街招 Stick a job posting",
        description:
          "你公司請人又想搵香港人？網上睇到份工又想人幫手？係到貼個街招，等人聯絡你。 Is your company hiring and looking for folks from Hong Kong? Stick a job posting here to get contacted.",
      },
    },
    editPost: {
      name: "編輯街招",
      href: "/post/edit",
    },
    referrerPost: {
      name: "街招",
      href: "/post/referer",
      metadata: {
        title: "街招",
        description:
          "係到搵有乜工搵人推薦。 Look for job postings and get referred.",
      },
    },
    postHistory: {
      name: "街招記錄",
      href: "/post/history",
    },
    about: {
      name: "關於本平台",
      href: "/about",
      metadata: {
        title: "關於本平台 About Us",
        description:
          "海外搵工好多時都需要人脈，有人推薦先有面試，而外地愈嚟愈多港人，但缺乏相關文化同平台。呢個平台喺俾大家搵翻同聲同氣嘅，無論你係藍領白領，都希望大家互相幫忙。 Finding a job overseas often required connections. People often need referrals to secure an interview. With more Hongkongers moving abroad, they need a platform to shine and stand out. That's where this platform comes in, to connect Hongkongers on the same wavelength, regardless of job nature.",
      },
    },
    privacyPolicy: {
      name: "privatePolicy",
      href: "/privacy-policy",
      metadata: {
        title: "隱私權政策 Private Policy",
        description: METADATA_DEFAULT_DESCRIPTION,
        robots: "noindex,nofollow",
      },
    },
    termsAndConditions: {
      name: "termsAndConditions",
      href: "/terms-and-conditions",
      metadata: {
        title: "條款及細則 Terms and Conditions",
        description: METADATA_DEFAULT_DESCRIPTION,
        robots: "noindex,nofollow",
      },
    },
    contributors: {
      name: "貢獻者名單",
      href: "/contributors",
      metadata: {
        title: "貢獻者名單 Contributor List",
        description: METADATA_DEFAULT_DESCRIPTION,
      },
    },
  },
  links: {
    instagram: "https://instagram.com/referalah?igshid=NGVhN2U2NjQ0Yg==",
    github: "https://github.com/Pjaijai/Referalah",
  },
}

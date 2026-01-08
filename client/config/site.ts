export type SiteConfig = typeof siteConfig

const METADATA_DEFAULT_DESCRIPTION =
  "人脈網絡平台，連接專業人士，建立職業關係，分享工作機會。Professional networking platform connecting professionals, building career relationships, and sharing job opportunities."

const NAME = "Referalah"
export const siteConfig = {
  name: NAME,
  description: "人脈網絡平台。",
  page: {
    main: {
      name: "main",
      href: "/",
    },
    profile: {
      name: "Profile",
      href: "/profile",
    },
    editProfile: {
      name: "Profile",
      href: "/profile/edit",
    },
    signUp: {
      name: "auth",
      href: "/auth/sign-up",
      metadata: {
        title: "註冊 Sign Up",
        description: "立即加入，永遠唔會遲！ Join now, never too late!",
      },
    },
    signUpConfirmation: {
      name: "註冊成功",
      href: "/auth/sign-up-confirmation",
      metadata: {
        title: "註冊成功! Registration success!",
      },
    },
    signIn: {
      name: "auth",
      href: "/auth/sign-in",
      metadata: {
        title: "登入 Sign In",
        description: "登入 Sign in",
      },
    },
    emailVerification: {
      name: "電郵認證",
      href: "/auth/email-verification",
      metadata: {
        title: "電郵認證 Email Verification",
      },
    },
    verifyOneTimePassword: {
      name: "驗證一次性密碼",
      href: "/auth/verify-one-time-password",
      metadata: {
        title: "驗證一次性密碼 One Time Password Verification",
      },
    },
    resetPassword: {
      name: "重置密碼",
      href: "/auth/reset-password",
      metadata: {
        title: "重置密碼 Reset Password",
      },
    },
    forgetPassword: {
      name: "忘記密碼",
      href: "/auth/forgot-password",
      metadata: {
        title: "忘記密碼 Forgot Password",
        description: "忘記密碼 Forgot Password",
      },
    },

    searchMember: {
      name: "會員",
      href: "/member/search",
      metadata: {
        title: "會員 members",
      },
    },
    createPost: {
      name: "貼街招",
      href: "/post/create",
      metadata: {
        title: "貼街招 Stick a job posting",
        description:
          "你公司請人又想搵人？網上睇到份工又想人幫手？係到貼個街招，等人聯絡你。 Is your company hiring and looking for folks? Stick a job posting here to get contacted.",
      },
    },
    editPost: {
      name: "編輯街招",
      href: "/post/edit",
    },
    searchPost: {
      name: "街招",
      href: "/post/search",
      metadata: {
        title: "街招",
        description: "係到搵有乜街招。 A wall for posts.",
      },
    },
    viewPost: {
      name: "街招",
      href: "/post/view",
      metadata: {
        title: "街招",
      },
    },
    createJobJourney: {
      href: "/job-journey/create",
      metadata: {
        title: "建立職途誌",
        description: "建立職途誌 Create Job Journey",
      },
    },
    updateJobJourney: {
      href: "/job-journey/update",
      metadata: {
        title: "更新職途誌",
        description: "更新職途誌 Update Job Journey",
      },
    },
    searchJobJourney: {
      href: "/job-journey/search",
      metadata: {
        title: "職途誌 Job Journey",
        description: "職途誌 Job Journey",
      },
    },
    viewJobJourney: {
      href: "/job-journey/view",
    },
    jobJourneyHistory: {
      name: "職途誌記錄",
      href: "/job-journey/history",
    },
    postHistory: {
      name: "街招記錄",
      href: "/post/history",
    },
    chat: {
      name: "對話",
      href: "/chat",
    },
    privacyPolicy: {
      name: "privatePolicy",
      href: "/privacy-policy",
      metadata: {
        title: "隱私政策 Privacy Policy",
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
    installation: {
      name: "安裝Referalah",
      href: "/installation",
      metadata: {
        title: "安裝Referalah Install Referalah",
        description: METADATA_DEFAULT_DESCRIPTION,
      },
    },
  },
  links: {
    instagram: "https://instagram.com/referalah?igshid=NGVhN2U2NjQ0Yg==",
    github: "https://github.com/Pjaijai/Referalah",
    buyMeACoffee: "https://buymeacoffee.com/paulwong169",
  },

  defaultMetaData: {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_WEB_URL || "https://referalah.com"
    ),
    title: {
      default: `${NAME} | 人脈網絡平台`,
      template: `%s | ${NAME}`,
    },
    description: METADATA_DEFAULT_DESCRIPTION,
    keywords: [
      // Brand
      "Referalah",

      // Connection Building - English
      "professional networking",
      "networking platform",
      "career networking",
      "build professional connections",
      "business networking",
      "professional relationships",
      "career connections",
      "networking community",
      "professional network",
      "connection building",

      // Connection Building - Chinese
      "人脈網絡",
      "建立人脈",
      "職業網絡",
      "專業人脈",
      "職場關係",
      "人脈平台",
      "拓展人脈",
      "專業連結",
      "職業關係",

      // Job Referrals
      "job referrals",
      "employee referrals",
      "internal referral",
      "referral program",
      "工作推薦",
      "內推",
      "內推平台",
      "職位推薦",

      // Opportunities
      "job opportunities",
      "career opportunities",
      "job search platform",
      "工作機會",
      "職業機會",
      "職缺分享",
      "求職平台",

      // Platform Features
      "professional community",
      "career development",
      "job posting platform",
      "職涯發展",
      "專業社群",
    ],
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      type: "website",
      locale: "en_ca",
      alternateLocale: ["zh_HK", "zh_TW"],
      url: process.env.NEXT_PUBLIC_WEB_URL,
      siteName: NAME,
      title: `${NAME} | 人脈網絡平台`,
      description: METADATA_DEFAULT_DESCRIPTION,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_WEB_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Referalah - Professional Networking Platform",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${NAME} | 人脈網絡平台`,
      description: METADATA_DEFAULT_DESCRIPTION,
      creator: "@referalah",
      site: "@referalah",
      images: [`${process.env.NEXT_PUBLIC_WEB_URL}/og-image.png`],
    },
  },
}

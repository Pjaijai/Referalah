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

    searchUser: {
      name: "會員",
      href: "/user/search",
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
          "你公司請人又想搵香港人？網上睇到份工又想人幫手？係到貼個街招，等人聯絡你。 Is your company hiring and looking for folks from Hong Kong? Stick a job posting here to get contacted.",
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

    postHistory: {
      name: "街招記錄",
      href: "/post/history",
    },
    chat: {
      name: "對話",
      href: "/chat",
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
  },
}

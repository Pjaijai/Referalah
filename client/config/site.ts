export type SiteConfig = typeof siteConfig

const METADATA_DEFAULT_DESCRIPTION =
  "海外港人平台。An overseas Hongkongers platform to build their connections and local community."

export const siteConfig = {
  name: "Referalah",
  description: "海外港人平台。",
  page: {
    main: {
      href: "/",
    },
    profile: {
      href: "/profile",
    },
    setting: {
      href: "/setting",
    },
    editProfile: {
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
      href: "/auth/email-verification",
      metadata: {
        title: "電郵認證 Email Verification",
      },
    },
    verifyOneTimePassword: {
      href: "/auth/verify-one-time-password",
      metadata: {
        title: "驗證一次性密碼 One Time Password Verification",
      },
    },
    resetPassword: {
      href: "/auth/reset-password",
      metadata: {
        title: "重置密碼 Reset Password",
      },
    },
    forgetPassword: {
      href: "/auth/forgot-password",
      metadata: {
        title: "忘記密碼 Forgot Password",
        description: "忘記密碼 Forgot Password",
      },
    },

    searchMember: {
      href: "/member/search",
      metadata: {
        title: "會員 members",
      },
    },
    createPost: {
      href: "/post/create",
      metadata: {
        title: "貼街招 Stick a job posting",
        description:
          "你公司請人又想搵香港人？網上睇到份工又想人幫手？係到貼個街招，等人聯絡你。 Is your company hiring and looking for folks from Hong Kong? Stick a job posting here to get contacted.",
      },
    },
    editPost: {
      href: "/post/edit",
    },
    searchPost: {
      href: "/post/search",
      metadata: {
        title: "街招",
        description: "係到搵有乜街招。 A wall for posts.",
      },
    },
    viewPost: {
      href: "/post/view",
      metadata: {
        title: "街招",
      },
    },

    postHistory: {
      href: "/post/history",
    },
    chat: {
      href: "/chat",
    },
    privacyPolicy: {
      href: "/privacy-policy",
      metadata: {
        title: "隱私政策 Privacy Policy",
        description: METADATA_DEFAULT_DESCRIPTION,
        robots: "noindex,nofollow",
      },
    },
    termsAndConditions: {
      href: "/terms-and-conditions",
      metadata: {
        title: "條款及細則 Terms and Conditions",
        description: METADATA_DEFAULT_DESCRIPTION,
        robots: "noindex,nofollow",
      },
    },
    contributors: {
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

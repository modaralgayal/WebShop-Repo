declare namespace NodeJS {
    interface ProcessEnv {
        STRIPE_PUBLIC_KEY: string,
        STRIPE_PRIVATE_KEY?: string
    }
  }

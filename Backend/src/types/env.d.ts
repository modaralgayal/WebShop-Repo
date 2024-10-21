declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGO_URL?: string;
    SECRET?: string;
    PUBLICKEY_OWN_SITE: string;
    PRIVATEKEY_OWN_SITE: string;
    STRIPE_PUBLIC_KEY: string;
    STRIPE_SECRET_KEY: string;
  }
}

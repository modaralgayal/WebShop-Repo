declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGO_URL?: string;
    SECRET?: string;
    PUBLICKEY: string;
    PRIVATEKEY: string;
    STRIPE_PUBLIC_KEY: string;
    STRIPE_SECRET_KEY: string;
  }
}

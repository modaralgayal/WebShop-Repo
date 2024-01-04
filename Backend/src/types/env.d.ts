declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGO_URL?: string;
    SECRET?: string;
    PUBLICKEY: string;
    PRIVATEKEY: string;
  }
}

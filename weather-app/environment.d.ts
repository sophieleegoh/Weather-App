declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      ApiKeys__0: string;
      ApiKeys__1: string;
    }
  }
}

export {};

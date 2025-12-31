interface Env {
  BOT_KEY: string;

  DB_HOST: string;
  DB_DATABASE: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;

  NODE_ENV: string;
}

const getEnv = (param: keyof Env) => {
  const value = Bun.env[param];
  if (value === undefined) {
    throw new Error(`Do not pass a required parameter in .env - ${param}`);
  }

  return value;
};

export default getEnv;

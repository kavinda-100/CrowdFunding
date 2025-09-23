import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_ALCHEMY_RPC_URL: z.url(),
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_CROWDFUNDING_FACTORY_CONTRACT_ADDRESS: z.string().min(1),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("Invalid environment variables:", env.error.format());
  throw new Error("Invalid environment variables");
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export default env;

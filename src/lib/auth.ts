import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { captcha, username } from "better-auth/plugins";
import { headers } from "next/headers";
import { db } from "~/lib/database";
import { env } from "~/lib/env";
import { GetCurrentUserResponse, Session, User } from "~/types/auth";
import * as schema from "./database/schemas/auth-schema";
import { forbidden } from "next/navigation";

export type ExtendedBetterAuthOptions = BetterAuthOptions & {
    authRedirect?: string;
};

export const auth = betterAuth({
    baseURL: env.NEXT_PUBLIC_BASE_URL,
    appName: env.NEXT_PUBLIC_APP_NAME,
    authRedirect: "/dashboard",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema,
        },
        usePlural: true,
    }),
    account: {
        accountLinking: {
            enabled: true,
            // trustedProviders: ["github", "discord"],
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        username(),
        captcha({
            provider: "cloudflare-turnstile",
            secretKey: env.TURNSTILE_SECRET_KEY,
            endpoints: ["/auth"],
        }),
    ],
});

export const toClientAuthOptions = (authOptions: BetterAuthOptions) => {
    const options: BetterAuthOptions = JSON.parse(JSON.stringify(authOptions));

    // Recursively remove any property that contains 'secret' from the entire object
    const removeSecrets = (obj: any) => {
        if (!obj || typeof obj !== "object") return;
        for (const key of Object.keys(obj)) {
            if (key.toLowerCase().includes("secret")) {
                delete obj[key];
            } else if (typeof obj[key] === "object") {
                removeSecrets(obj[key]);
            }
        }
    };

    removeSecrets(options);
    return options;
};

export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) forbidden();
    return {
        session: session.session as Session,
        user: session.user as User,
    };
};

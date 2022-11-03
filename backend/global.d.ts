export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB_URI: string;
            GOOGLE_CLIENT_ID: string;
            GOOGLE_CLIENT_SECRET: string;
            GOOGLE_OAUTH_REDIRECT_URL: string;
        }
    }

}
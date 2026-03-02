import { createSqliteAuthService } from "./auth.service.sqlite";
// import { createBetterAuthService } from "./better/auth.service.better"; // v0.2

export const authService = createSqliteAuthService();
// luego lo pasamos a: createBetterAuthService()

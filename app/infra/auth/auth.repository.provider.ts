import { createSqliteAuthRepository } from "./auth.repository.sqlite";
// import { createBetterAuthRepository } from "./better/auth.service.better"; // v0.2

export const authRepository = createSqliteAuthRepository();
// luego lo pasamos a: createBetterAuthRepository()

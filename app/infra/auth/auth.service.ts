import { createManualAuthService } from "./auth.service.manual";
// import { createBetterAuthService } from "./better/auth.service.better"; // v0.2

export const authService = createManualAuthService();
// luego lo pasamos a: createBetterAuthService()

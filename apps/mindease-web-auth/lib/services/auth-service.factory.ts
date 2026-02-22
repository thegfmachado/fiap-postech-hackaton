import { cookies } from "next/headers";

import { AuthQueriesService } from "@mindease/database/queries";
import { createServerClient } from "@mindease/database/server";

import { AuthService } from "./auth-service/auth-service";

export async function createAuthService() {
  const cookieStore = await cookies();
  const client = await createServerClient(cookieStore);
  return new AuthService(new AuthQueriesService(client));
}

import { cookies } from "next/headers";
import { createServerClient } from "@mindease/database/server";
import { SettingsService } from "./settings-service";
import { SettingsQueriesService } from "@mindease/database/queries";

export async function createSettingsService() {
  const cookieStore = await cookies();
  const client = await createServerClient(cookieStore);
  return new SettingsService(new SettingsQueriesService(client));
}

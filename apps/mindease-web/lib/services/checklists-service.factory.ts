import { cookies } from "next/headers";
import { createServerClient } from "@mindease/database/server";
import { ChecklistsService } from "./checklists-service/checklists-service";
import { ChecklistsQueriesService } from "@mindease/database/queries";

export async function createChecklistsService() {
  const cookieStore = await cookies();
  const client = await createServerClient(cookieStore);
  return new ChecklistsService(new ChecklistsQueriesService(client));
}

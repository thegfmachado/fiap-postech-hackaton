import { cookies } from "next/headers";
import { createServerClient } from "@mindease/database/server";
import { TaskService } from "./tasks-service";
import { TasksQueriesService } from "@mindease/database/queries";

export async function createTaskService() {
  const cookieStore = await cookies();
  const client = await createServerClient(cookieStore);
  return new TaskService(new TasksQueriesService(client));
}

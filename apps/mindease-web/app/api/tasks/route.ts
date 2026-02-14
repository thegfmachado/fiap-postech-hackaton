import { createTaskService } from "@/lib/services/tasks-service.factory";
import { handleResponseError } from "@mindease/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const params: Record<string, string> = {};

    for (const [key, value] of searchParams) {
      params[key] = value;
    }

    const service = await createTaskService();
    const tasks = await service.get(params);
    return NextResponse.json(tasks);
  } catch (err) {
    return handleResponseError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const service = await createTaskService();
    const task = await service.create(data);
    return NextResponse.json(task);
  } catch (err) {
    return handleResponseError(err);
  }
}


import { createTaskService } from "@/lib/services/tasks-service.factory";
import { handleResponseError } from "@mindease/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: RouteContext<'/api/tasks/[id]'>) {
  try {
    const { id } = await params;
    const service = await createTaskService();
    const task = await service.getById(id);
    return NextResponse.json(task);
  } catch (err) {
    return handleResponseError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext<'/api/tasks/[id]'>) {
  try {
    const { id } = await params;
    const data = await req.json();

    if (!data || Object.keys(data).length === 0) {
      return new NextResponse('Invalid or empty update data', { status: 400 });
    }

    const service = await createTaskService();
    const updated = await service.update(id, data);
    return NextResponse.json(updated);
  } catch (err) {
    return handleResponseError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext<'/api/tasks/[id]'>) {
  try {
    const { id } = await params;
    const service = await createTaskService();
    await service.delete(id);
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (err) {
    return handleResponseError(err);
  }
}
import { createChecklistsService } from "@/lib/services/checklists-service.factory";
import { handleResponseError } from "@mindease/services";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: RouteContext<'/api/tasks/[id]/checklists/[itemId]'>) {
  try {
    const { itemId } = await params;
    const { completed } = await req.json();

    if (typeof completed !== 'boolean') {
      return new NextResponse('Invalid completed value', { status: 400 });
    }

    const service = await createChecklistsService();
    const checklist = await service.update(itemId, completed);
    return NextResponse.json(checklist);
  } catch (err) {
    return handleResponseError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext<'/api/tasks/[id]/checklists/[itemId]'>) {
  try {
    const { itemId } = await params;
    const service = await createChecklistsService();
    await service.delete(itemId);
    return NextResponse.json({ message: 'Checklist item deleted successfully' });
  } catch (err) {
    return handleResponseError(err);
  }
}

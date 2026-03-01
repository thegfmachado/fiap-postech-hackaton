import { createChecklistsService } from "@/lib/services/checklists-service.factory";
import { handleResponseError } from "@mindease/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: RouteContext<'/api/tasks/[id]/checklists'>) {
  try {
    const { id } = await params;
    const service = await createChecklistsService();
    const checklists = await service.getByTaskId(id);
    return NextResponse.json(checklists);
  } catch (err) {
    return handleResponseError(err);
  }
}

export async function POST(req: NextRequest, { params }: RouteContext<'/api/tasks/[id]/checklists'>) {
  try {
    const { id } = await params;
    const { descriptions } = await req.json();

    if (!descriptions || !Array.isArray(descriptions) || descriptions.some(desc => typeof desc !== 'string')) {
      return new NextResponse('Invalid checklist items', { status: 400 });
    }

    const service = await createChecklistsService();
    const checklist = await service.create(id, descriptions);
    return NextResponse.json(checklist, { status: 201 });
  } catch (err) {
    return handleResponseError(err);
  }
}

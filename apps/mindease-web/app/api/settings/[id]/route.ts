import { createSettingsService } from "@/lib/services/settings/settings-service.factory";
import { handleResponseError } from "@mindease/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: RouteContext<'/api/settings/[id]'>) {
  try {
    const { id } = await params;
    const service = await createSettingsService();
    const settings = await service.getById(id);
    return NextResponse.json(settings);
  } catch (err) {
    return handleResponseError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext<'/api/settings/[id]'>) {
  try {
    const { id } = await params;
    const data = await req.json();
    if (!data || Object.keys(data).length === 0) {
      return new NextResponse('Invalid or empty update data', { status: 400 });
    }

    const service = await createSettingsService();
    const updated = await service.update(id, data);
    return NextResponse.json(updated);
  } catch (err) {
    return handleResponseError(err);
  }
}
import { createAuthService } from "@mindease-web-auth/lib/services/auth-service.factory";
import { NextResponse } from "next/server";

import { handleResponseError } from "@mindease/services/http";

export async function POST() {
  try {
    const service = await createAuthService();
    await service.signOut();
    return NextResponse.json({ message: 'Signout realizado com sucesso' });
  } catch (err) {
    return handleResponseError(err);
  }
}

import { createAuthService } from "@mindease-web-auth/lib/services/auth-service.factory";
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { handleResponseError } from "@mindease/services/http";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const service = await createAuthService();
    await service.forgotPassword(data.email);
    return NextResponse.json({ message: 'Email de recuperação enviado com sucesso.' });
  } catch (err) {
    return handleResponseError(err);
  }
}

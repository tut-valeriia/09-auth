import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { parseSetCookie } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("auth/login", body);

    const res = NextResponse.json(apiRes.data, { status: apiRes.status });
    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        const parsed = parseSetCookie(cookieStr);

        if (parsed.name && parsed.value) {
          res.cookies.set(parsed.name, parsed.value, {
            httpOnly: parsed.httpOnly,
            secure: process.env.NODE_ENV === "production",
            maxAge: parsed.maxAge,
            expires: parsed.expires,
            sameSite: "lax",
            path: parsed.path || "/",
          });
        }
      }

      return res;
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status || 500 },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

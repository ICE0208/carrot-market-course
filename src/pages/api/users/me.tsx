import client from "@/libs/server/client";
import { withIronSessionApiRoute } from "iron-session/next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  console.log(req.session.user);
  const profile = await client.user.findUnique({
    where: { id: req.session.user?.id },
  });
  res.json({
    ok: true,
    profile,
  });
}

export default withIronSessionApiRoute(withHandler("GET", handler), {
  cookieName: "carrotsession",
  password: process.env.SESSION_PW!,
});

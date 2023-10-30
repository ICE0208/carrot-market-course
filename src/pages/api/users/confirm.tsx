import client from "@/libs/server/client";
import { withIronSessionApiRoute } from "iron-session/next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const { token } = req.body;
  const exists = await client.token.findUnique({
    where: {
      payload: token,
    },
  });
  if (!exists) res.status(400).end();
  req.session.user = {
    id: exists?.userId,
  };
  await req.session.save();

  res.status(200).end();
}

export default withIronSessionApiRoute(withHandler("POST", handler), {
  cookieName: "carrotsession",
  password: process.env.SESSION_PW!,
});

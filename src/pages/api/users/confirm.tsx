import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";
import { deleteUserToken } from "@/libs/server/deleteUserToken";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const { token } = req.body;
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
  });
  if (!foundToken) return res.status(400).end();
  req.session.user = {
    id: foundToken.userId,
  };
  await req.session.save();
  await deleteUserToken(foundToken.userId);
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ["POST"], fn: handler, isPrivate: false }),
);

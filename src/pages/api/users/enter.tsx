import twilio from "twilio";
import nodemailer from "nodemailer";
import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const { phone, email } = req.body;
  const userInfo = phone ? { phone: +phone } : email ? { email } : null;
  if (!userInfo) return res.status(400).json({ ok: false });
  const user = await client.user.findUnique({
    where: { ...userInfo },
  });

  // 기존 토큰 삭제
  if (user) {
    const oldTokens = await client.token.findMany({
      where: {
        userId: user.id,
      },
    });

    // 이제 oldTokens를 비동기적으로 삭제합니다.
    const deletionPromises = oldTokens.map((token) => {
      return client.token.delete({
        where: {
          id: token.id,
        },
      });
    });

    await Promise.all(deletionPromises); // 모든 삭제 작업을 병렬로 실행
  }

  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const newToken = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...userInfo,
          },
          create: {
            name: "Anonymous",
            ...userInfo,
          },
        },
      },
    },
  });
  if (phone) {
    // await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.PHONE_NUMBER!,
    //   body: `Your login token is ${payload}`,
    // });
  }
  if (email) {
    // const transporter = nodemailer.createTransport({
    //   service: process.env.EMAIL_SERVICE!,
    //   auth: {
    //     user: process.env.EMAIL_USER!,
    //     pass: process.env.EMAIL_PW!,
    //   },
    // });
    // const mailOptions = {
    //   from: process.env.EMAIL_USER!,
    //   to: email,
    //   subject: "Carrot Market Verification Email",
    //   html: `<strong>Your token is ${payload}</strong>`,
    // };
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error(error);
    //   } else {
    //     console.log("Email Sent : ", info);
    //   }
    // });
  }

  return res.json({
    ok: true,
  });
}

export default withHandler("POST", handler);

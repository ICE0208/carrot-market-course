import twilio from "twilio";
import nodemailer from "nodemailer";
import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteUserToken } from "@/libs/server/deleteUserToken";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const { phone, email } = req.body;
  const userInfo = phone ? { phone: phone } : email ? { email } : null;
  if (!userInfo) return res.status(400).json({ ok: false });

  // 기존 토큰 삭제
  const user = await client.user.findUnique({
    where: { ...userInfo },
  });

  if (user) {
    await deleteUserToken(user.id);
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

import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../../db/entities/User';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { ISocial } from '../../../types/ISocial';

export default async (req: Request, res: Response) => {
  const { idToken, oauthType } = req.body as ISocial;

  const client = new OAuth2Client(process.env.GOOGLE_CLIENTID);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENTID,
  });

  const payload = ticket.getPayload();

  if (payload === undefined) {
    res.status(409).send('error');
  } else {
    const socialId = payload['sub'];
    const nickname = payload['name'];

    const token = jwt.sign(
      {
        socialId,
      },
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${process.env.TOKEN_SECRET}`
    );

    const user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.socialId= :socialId', { socialId })
      .getOne();

    if (user === undefined) {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          oauthType,
          nickname,
          socialId,
          token,
        })
        .execute()
        .then((result) => {
          return res.status(201).json({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            userId: result.generatedMaps[0].id,
            nickname,
            token,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ token })
        .where('socialId = :socialId', { socialId })
        .execute()
        .catch((error) => {
          console.log(error);
        });

      await getRepository(User)
        .createQueryBuilder('user')
        .where('user.socialId= :socialId', { socialId })
        .getOne()
        .then((result) => {
          return res.status(201).json({
            userId: result?.id,
            nickname: result?.nickname,
            token: result?.token,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  return res.status(400);
};

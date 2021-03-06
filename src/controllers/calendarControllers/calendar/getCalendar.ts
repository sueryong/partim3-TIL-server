import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Calendar } from '../../../db/entities/Calendar';

export default async (req: Request, res: Response): Promise<Response> => {
  const userId = Number(req.query.userId);

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id= :userId', { userId })
      .getOne();

    if (!_user) {
      return res.status(400).send('유저 정보 없음');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const _myCalendarsAuthoritys = getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.CalendarAuthorities', 'CalendarAuthorities')
      .select('CalendarAuthorities.calendar')
      .where('user.id = :userId', { userId })
      .andWhere('CalendarAuthorities.ownerId = :userId', { userId });

    const _myCalendars = await getRepository(Calendar)
      .createQueryBuilder('calendar')
      .where('calendar.id IN (' + _myCalendarsAuthoritys.getQuery() + ')')
      .setParameters(_myCalendarsAuthoritys.getParameters())
      .getMany();

    const _shareCalendarsAuthoritys = getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.CalendarAuthorities', 'CalendarAuthorities')
      .select('CalendarAuthorities.calendar')
      .where('user.id = :userId', { userId })
      .andWhere('CalendarAuthorities.ownerId != :userId', { userId });

    const _shareCalendars = await getRepository(Calendar)
      .createQueryBuilder('calendar')
      .where('calendar.id IN (' + _shareCalendarsAuthoritys.getQuery() + ')')
      .setParameters(_shareCalendarsAuthoritys.getParameters())
      .getMany();

    return res.status(200).json({
      myCalendars: _myCalendars,
      shareCalendars: _shareCalendars,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

import Card from '../../../server/models/card';
import User from '../../../server/models/user';
import { Op } from 'sequelize';

import { QueryTypes, Sequelize } from 'sequelize';
import { Literal } from 'sequelize/types/utils';

export default async (req, res) => {
  if (req.query.type === 'card') {
    try {
      const cards = await Card.findAll({
        where: {
          monsterName: {
            [Op.iLike]: `%${req.query.name}%`,
          },
        },
        attributes: {
          include: [
            [
              Sequelize.literal(`(
                    SELECT COUNT(*)::int
                    FROM upvotes
                    WHERE
                        upvotes."CardId"= "Card".id
                    AND
                        upvotes."deleted"= false
                )`),
              'upvoteCount',
            ],
            [
              Sequelize.literal(`(
                    SELECT COUNT(*)::int
                    FROM collected
                    WHERE
                        collected."CardId"= "Card".id
                    AND
                        collected."deleted"= false
                )`),
              'collectedCount',
            ],
            ...(req.query.session
              ? [
                  [
                    Sequelize.literal(`(
                      SELECT count(*)::int
                      FROM upvotes
                      WHERE
                          upvotes."CardId"= "Card".id
                      AND
                          upvotes."user_id"= '${req.query.session}'
                      AND
                          upvotes."deleted" = false

                  )`),
                    'userUpvoteCount',
                  ] as [Literal, string],
                ]
              : null),
            ...(req.query.session
              ? [
                  [
                    Sequelize.literal(`(
                      SELECT count(*)::int
                      FROM collected
                      WHERE
                          collected."CardId"= "Card".id
                      AND
                          collected."user_id"= '${req.query.session}'
                      AND
                          collected."deleted" = false

                  )`),
                    'userCollectedCount',
                  ] as [Literal, string],
                ]
              : null),
          ],
        },
      });
      res.send(JSON.stringify(cards));
    } catch (error) {
      console.log(error);
    }
  }
  if (req.query.type === 'user') {
    try {
      const users = await User.findAll({
        where: {
          username: {
            [Op.iLike]: `%${req.query.name}%`,
          },
        },
      });
      res.send(JSON.stringify(users));
    } catch (error) {
      console.log(error);
    }
  }
};

import type { NextApiRequest, NextApiResponse } from 'next';
import Card from '../../../server/models/card';
import { Sequelize } from 'sequelize/types';
import { Literal } from 'sequelize/types/utils';

// /api/cards/list?username=<USERNAME>&sessionId=<SESSION_ID>

export default function cardListHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { username, sessionId },
    method,
  } = req;

  switch (method) {
    case 'GET':
      if (username) {
        Card.findAll({
          where: {
            userName: username,
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
              ...(sessionId
                ? [
                    [
                      Sequelize.literal(`(
                            SELECT count(*)::int
                            FROM upvotes
                            WHERE
                                upvotes."CardId"= "Card".id
                            AND
                                upvotes."user_id"= '${sessionId}'
                            AND
                                upvotes."deleted" = false

                        )`),
                      'userUpvoteCount',
                    ] as [Literal, string],
                  ]
                : null),
            ],
          },
          // include: [Upvote],
        })
          .then((cards) => {
            res.status(200).json(cards);
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

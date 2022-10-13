import { Sequelize } from 'sequelize/types';
import { Literal } from 'sequelize/types/utils';
import Card from '../../../server/models/card';

export default async (req, res) => {
    const { profile_name, profile_id } = req.body;

  // const { monsterName, userName, desc, img, userId} = req
  try {
    let cards = await Card.findAll({
      where: {
        userName: req.profileName,
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
          ...(session
            ? [
                [
                  Sequelize.literal(`(
                      SELECT count(*)::int
                      FROM upvotes
                      WHERE
                          upvotes."CardId"= "Card".id
                      AND
                          upvotes."user_id"= '${session.id}'
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
    });
  } catch (error) {
    console.log(error);
  }
};

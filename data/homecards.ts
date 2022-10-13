import Card from "../server/models/card";
import Upvote from "../server/models/upvote";
import { Sequelize } from 'sequelize';
import { Literal } from 'sequelize/types/utils';

let getCards = async function(session){
    let cards = await Card.findAll({
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
        ...(session
          ? [
              [
                Sequelize.literal(`(
                      SELECT count(*)::int
                      FROM collected
                      WHERE
                          collected."CardId"= "Card".id
                      AND
                          collected."user_id"= '${session.id}'
                      AND
                          collected."deleted" = false

                  )`),
                'userCollectedCount',
              ] as [Literal, string],
            ]
          : null),
      ],
    },
    include: [Upvote],
  });

  // cards = JSON.parse(JSON.stringify(cards));

  return cards
}

export default getCards

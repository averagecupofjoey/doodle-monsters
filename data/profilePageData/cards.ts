import { QueryTypes, Sequelize } from "sequelize";
import { Literal } from "sequelize/types/utils";
import Card from "../../server/models/card";

import { dbConnection } from "../../server/database";

const COLLECTED_CARDS_QUERY = (userID, loggedUserID) =>
  `SELECT
cards.*,
upvotes.upvoteCount,
userUpvotes.userUpvoteCount,
collects.collectedCount,
userCollected.userCollectedCount
FROM cards
INNER JOIN collected on collected.card_id = cards.id AND collected.user_id = '${userID}'
LEFT JOIN (
  SELECT card_id, COUNT(*) as upvoteCount
  FROM upvotes
  WHERE upvotes.deleted = false
  GROUP BY card_id
) upvotes
ON upvotes.card_id = cards.id
LEFT JOIN (
  SELECT card_id, count(*) as userUpvoteCount
  FROM upvotes
  WHERE upvotes.user_id = '${loggedUserID}'
    AND upvotes.deleted = false
  GROUP BY card_id
) userUpvotes
ON userUpvotes.card_id = cards.id
LEFT JOIN (
  SELECT card_id, count(*) as collectedCount
  FROM collected
  WHERE collected.deleted = false
  GROUP BY card_id
) collects
ON collects.card_id = cards.id
LEFT JOIN (
  SELECT card_id, count(*) as userCollectedCount
  FROM collected
  WHERE collected.user_id= '${loggedUserID}'
    AND collected.deleted = false
  GROUP BY card_id
) userCollected
ON userCollected.card_id = cards.id`;



let getProfileCards = async function(session, profileId){
    let cards = await Card.findAll({
    where: {
      userId: profileId,
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
  });

  let collectedCards = await dbConnection.query<Card>(
    COLLECTED_CARDS_QUERY(profileId, session.id),
    {
      type: QueryTypes.SELECT,
    }
  );

  return {
    cards,
    collectedCards
  }
}

export default getProfileCards

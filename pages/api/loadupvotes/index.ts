import { where } from "sequelize/types";
import Upvote from "../../../server/models/upvote";

export default async (req, res) => {
  try {
    const upvotes = await Upvote.count({where: {card_id: req.params.card_Id, deleted: 'false'}})
    console.log("**** load upvotes api", upvotes);
    res.send(JSON.stringify(upvotes))
  } catch (error) {
    console.log(error)
  }
}

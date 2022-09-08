import Upvote from "../../../server/models/upvote";

export default async (req, res) => {
  try {
    console.log("!!!!!!!!", req.body)
    const id = req.body.user_id.concat(req.body.card_id)
    const upvote = await Upvote.update({deleted: !req.body.userDeleted},{ where: {
      id: id
    }
    })
    console.log("THIS IS THE UPVOTE", upvote)
    res.status(200).json(upvote)
  } catch (error) {
    console.log(error)
  }
}

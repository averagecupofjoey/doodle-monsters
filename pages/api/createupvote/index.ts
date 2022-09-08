import Upvote from "../../../server/models/upvote";

export default async (req, res) => {
  try {
    console.log("**** In createupvote api with request:", req.body)
    const id = req.body.user_id.concat(req.body.card_id)
    const upvote = await Upvote.create({
      id: id,
      user_id: req.body.user_id,
      card_id: req.body.card_id,
      CardId: req.body.card_id

    })
    console.log("**** THIS IS THE UPVOTE in createupvote api:", upvote)
    res.status(200).json(upvote)
  } catch (error) {
    console.log(error)
  }
}

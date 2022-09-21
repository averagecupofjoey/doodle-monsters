import Upvote from '../../../server/models/upvote';

export default async (req, res) => {

  console.log("In toggle upvote, req is :", req.body)
  try {
    const id = req.body.user_id.concat(req.body.card_id);
    // check if there is already a record
    const record = await Upvote.findByPk(id)
    console.log("the record returned is", record)

    // if there is no record --> it means you are upvoting
    // insert a new record
    if(record === null){
      console.log("No upvote exists, creating now")
      const upvote = await Upvote.create({
      id: id,
      user_id: req.body.user_id,
      card_id: req.body.card_id,
      CardId: req.body.card_id
    })
      res.status(200).json(upvote)
  } else {
    console.log("found upvote, updating it")
    console.log("record is:", record)
    // if there is a record
    // get that record
    // toggle the deleted flag
    // update the record
    const upvote = await Upvote.update(
      { deleted: !record.deleted },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).json(upvote);
    }
  } catch (error) {
    console.log(error);
  }
};

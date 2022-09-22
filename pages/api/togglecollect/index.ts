import Collect from "../../../server/models/collect";

export default async (req, res) => {

  try {
    // should I do a check to make sure the user id isn't the same as the card for security purposes?

    const id = req.body.user_id.concat(req.body.card_id);
    // check if there is already a record
    const record = await Collect.findByPk(id)
    console.log("the record returned is", record)

    // if there is no record --> it means you are upvoting
    // insert a new record
    if(record === null){
      console.log("No collect exists, creating now")
      const collect = await Collect.create({
      id: id,
      user_id: req.body.user_id,
      card_id: req.body.card_id,
      CardId: req.body.card_id
    })
      res.status(200).json(collect)
  } else {
    console.log("found collect, updating it")
    console.log("record is:", record)
    // if there is a record
    // get that record
    // toggle the deleted flag
    // update the record
    const collect = await Collect.update(
      { deleted: !record.deleted },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).json(collect);
    }
  } catch (error) {
    console.log(error);
  }
};

import Following from "../../../server/models/following";

export default async (req, res) => {

  try {
    // should I do a check to make sure the user id isn't the same as the card for security purposes?

    const id = req.body.user_id.concat(req.body.card_id);
    // check if there is already a record
    const record = await Following.findByPk(id)
    console.log("the record returned is", record)

    // if there is no record --> it means you are upvoting
    // insert a new record
    if(record === null){
      console.log("No collect exists, creating now")
      const following = await Following.create({
      id: id,
      follower_id: req.body.user_id,
      following_id: req.body.card_id,
    })
      res.status(200).json(following)
  } else {
    console.log("found following, updating it")
    console.log("record is:", record)
    // if there is a record
    // get that record
    // toggle the deleted flag
    // update the record
    const following = await Following.update(
      { unfollowed: !record.unfollowed },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).json(following);
    }
  } catch (error) {
    console.log(error);
  }
};

import { dbConnection } from "../../../server/database";
import Card from "../../../server/models/card";



export default async (req, res) => {
    // const { monsterName, userName, desc, img, userId} = req
    try {
       const card = await Card.create({
        monsterName: req.body.monsterName,
        userName: req.body.userName,
        desc: req.body.desc,
        img: req.body.img,
        userId: req.body.userId,
        monsterType: req.body.monsterType
    })
    res.status(200).json(card)


  } catch ( error ) {
      console.log( error );
  }

  };

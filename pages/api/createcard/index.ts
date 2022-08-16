import { dbConnection } from "../../../server/database";
import Card from "../../../server/models/card";



export default async (req, res) => {
    // const { monsterName, userName, desc, img, userId} = req
    try {
       await Card.create({
        monsterName: req.body.monsterName,
        userName: req.body.userName,
        desc: req.body.desc,
        img: req.body.img,
        userId: req.body.userId
    })
  } catch ( error ) {
      console.log( error );
  }


  };

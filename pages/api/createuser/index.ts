import { dbConnection } from "../../../server/database";
import User from "../../../server/models/user";



export default async (req, res) => {
    // const { monsterName, userName, desc, img, userId} = req
    try {
       await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })
  } catch ( error ) {
      console.log( error );
  }


  };

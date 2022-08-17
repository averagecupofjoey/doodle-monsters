import Card from "../../../server/models/card";



export default async (req, res) => {
    // const { monsterName, userName, desc, img, userId} = req
    try {
       const cards = await Card.findAll()
       console.log("All cards:", JSON.stringify(cards))
       res.send(JSON.stringify(cards))
  } catch ( error ) {
      console.log( error );
  }


  };

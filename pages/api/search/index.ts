import Card from '../../../server/models/card';
import User from '../../../server/models/user';
import { Op } from 'sequelize';

export default async (req, res) => {
  if (req.query.type === 'card') {
    try {
      const cards = await Card.findAll({
        where: {
          monsterName: {
            [Op.iLike]: `%${req.query.name}%`,
          },
        },
      });
      res.send(JSON.stringify(cards));
    } catch (error) {
      console.log(error);
    }
  }
  if (req.query.type === 'user') {
    try {
      const users = await User.findAll({
        where: {
          username: {
            [Op.iLike]: `%${req.query.name}%`,
          },
        },
      });
      res.send(JSON.stringify(users));
    } catch (error) {
      console.log(error);
    }
  }
};

import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import { dbConnection } from '../database';

import Upvote from './upvote';
import Collect from './collect'

export interface CardAttributes {
  id: string;
  userId: string;
  monsterName: string;
  userName: string;
  img: string;
  desc: string;
  monsterType: string;
}

// if multiple otional attributes it woud be Optional<CardAttributes, "id"|"desc"|"img"> etc.
type CardCreationAttributes = Optional<CardAttributes, "id">


export class Card extends Model<CardAttributes, CardCreationAttributes> {
  // static associate(models){
  //   Card.hasMany(models.Upvote)
  // }
}

Card.init(
  {
    id: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
      defaultValue: UUIDV4()
    },
        userId: {
      type: DataTypes.STRING,
    },
    monsterName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    monsterType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize: dbConnection,
    tableName: 'cards',
    timestamps: false,
  }
);

// Upvote.belongsTo(Card, {
//   foreignKey: 'card_id'
// })

Upvote.belongsTo(Card)

Card.hasMany(Upvote)

Collect.belongsTo(Card)

Card.hasMany(Collect)

export default Card;

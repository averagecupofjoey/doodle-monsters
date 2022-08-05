import { Sequelize } from 'sequelize';
import { dbConnection } from '../database';
import { DataTypes, Model } from 'sequelize';
import { ModelDefined } from 'sequelize';

interface CardAttributes {
  // id: string;
  username: string;
  password: string;
  email: string;
}

interface UserCreationAttributes {
  username: string;
  password: string;
  email: string;
}

class Card extends Model<CardAttributes, 'id'> {}

Card.init(
  {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: {
          msg: 'Must be a valid Email!',
        },
      },
    },
  },
  {
    sequelize: dbConnection,
    tableName: 'users',
    timestamps: false,
  }
);

export default Card;

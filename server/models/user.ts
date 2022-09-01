import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import { dbConnection } from '../database';

interface UserAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
}

// if multiple otional attributes it woud be Optional<UserAttributes, "id"|"desc"|"img"> etc.
type UserCreationAttributes = Optional<UserAttributes, "id">


class User extends Model<UserAttributes, UserCreationAttributes> {}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
      defaultValue: UUIDV4()
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
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
    }
  },
  {
    sequelize: dbConnection,
    tableName: 'users',
    timestamps: false,
  }
);

export default User;

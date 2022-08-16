// import { Sequelize } from 'sequelize';
// import { dbConnection } from '../database';
// import { DataTypes, Model } from 'sequelize';
// import { ModelDefined } from 'sequelize';

// interface UserAttributes {
//   id: string;
//   username: string;
//   password: string;
//   email: string;
// }

// interface UserCreationAttributes {
//   username: string;
//   password: string;
//   email: string;
// }

// class User extends Model<UserAttributes, 'id'> {}

// User.init(
//   {
//     id: {
//       type: DataTypes.STRING,
//       unique: true,
//       primaryKey: true
//     },
//     username: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     email: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//         isEmail: {
//           msg: 'Must be a valid Email!',
//         },
//       },
//     },
//   },
//   {
//     sequelize: dbConnection,
//     tableName: 'users',
//     timestamps: false,
//   }
// );

// export default User;

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

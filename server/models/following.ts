import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import { dbConnection } from '../database';

export interface FollowingAttributes {
  id: string;
  follower_id: string;
  followed_id: string;
  unfollowed: boolean;
}

// if multiple otional attributes it woud be Optional<UserAttributes, "id"|"desc"|"img"> etc.
type FollowingCreationAttributes = Optional<FollowingAttributes, "id">


class Following extends Model<FollowingAttributes, FollowingCreationAttributes> {
  declare id: string;
  declare follower_id: string;
  declare followed_id: string;
  declare unfollowed: boolean;
}

Following.init(
  {
    id: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
    },
    follower_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    followed_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    unfollowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      defaultValue: false
    }
  },
  {
    sequelize: dbConnection,
    tableName: 'following',
    timestamps: false,
  }
);

export default Following;

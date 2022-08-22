import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import { dbConnection } from '../database';

interface UpvoteAttributes {
  card_id: string;
  user_id: string;
  deleted: boolean;
  upvotes_pkey: string;
}

// if multiple otional attributes it woud be Optional<UserAttributes, "id"|"desc"|"img"> etc.
type UpvoteCreationAttributes = Optional<UpvoteAttributes, "upvotes_pkey">


class Upvote extends Model<UpvoteAttributes, UpvoteCreationAttributes> {}


Upvote.init(
  {
    upvotes_pkey:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    card_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    deleted: {
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
    tableName: 'upvotess',
    timestamps: false,
  }
);

export default Upvote;

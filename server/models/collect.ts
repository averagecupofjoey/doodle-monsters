import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import { dbConnection } from '../database';


export interface CollectAttributes {
  id: string;
  card_id: string;
  user_id: string;
  deleted: boolean;
  // upvotes_pkey: string;
  CardId: string
}

// if multiple otional attributes it woud be Optional<UserAttributes, "id"|"desc"|"img"> etc.
// type UpvoteCreationAttributes = Optional<UpvoteAttributes, "upvotes_pkey">


// class Upvote extends Model<UpvoteAttributes, UpvoteCreationAttributes> {}
class Collect extends Model<CollectAttributes> {
  // static associate(models){
  //   Upvote.belongsTo(models.Card)
  // }
  declare deleted: boolean;
  declare id: string;
  declare card_id: string;
  declare user_id: string;
  declare CardId: string;
}


Collect.init(
  {
    id:{
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    card_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    CardId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Card",
        key: 'id',
      }
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
      defaultValue: false
    }
  },
  {
    sequelize: dbConnection,
    tableName: 'collected',
    timestamps: false,
  }
);

export default Collect;

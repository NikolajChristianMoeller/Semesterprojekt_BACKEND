import sequelize from "./Sequalize.js";
import { DataTypes } from "sequelize";

//define structure of table

const Collection = sequelize.define(
    "Collection",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      createdAt: false,
      timestamps: false,
      updatedAt: false,
    }
  );

export default Collection
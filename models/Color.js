import sequelize from "./Sequalize.js";
import { DataTypes } from "sequelize";

//define structure of table

const Color = sequelize.define(
    "Color",
    {
      Code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
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

export default Color
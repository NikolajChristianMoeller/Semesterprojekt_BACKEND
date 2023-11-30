import sequelize from "./Sequalize.js";
import { DataTypes } from "sequelize";

const Image = sequelize.define(
    "Image",
    {
      href: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      Description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      createdAt: false,
      timestamps: false,
      updatedAt: false,
    }
  );

export default Image
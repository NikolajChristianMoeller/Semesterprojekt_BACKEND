import sequelize from "./Sequalize.js";
import { DataTypes } from "sequelize";

const Review = sequelize.define("Review", {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    Reviewer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    Text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

export default Review
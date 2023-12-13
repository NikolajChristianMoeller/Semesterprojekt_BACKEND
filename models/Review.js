import sequelize from "./Sequalize.js";
import { DataTypes } from "sequelize";

//define structure of table

const Review = sequelize.define("Review", {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
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
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

export default Review
import sequelize from "./Sequalize.js";
import { DataTypes } from "sequelize";

const Product = sequelize.define("Product", {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Stock: {
      type: DataTypes.INTEGER,
    },
    Images: {
      type: DataTypes.TEXT,
    }
  });

  export default Product
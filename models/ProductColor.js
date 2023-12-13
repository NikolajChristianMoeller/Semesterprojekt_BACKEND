import sequelize from "./Sequalize.js";
import { DataTypes } from "sequelize";

//define structure of table

const ProductColor = sequelize.define(
    "Product_Color",
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Product",
          key: "ID",
        },
      },
      color_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Color",
          key: "ID",
        },
      },
    },
    {
      createdAt: false,
      timestamps: false,
      updatedAt: false,
    }
  );

export default ProductColor
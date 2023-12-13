import sequelize from "./Sequalize.js";
import { DataTypes } from "sequelize";

//define structure of table

const ProductCollection = sequelize.define(
    "Product_Collection",
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Product",
          key: "ID",
        },
      },
      collection_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Collection",
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

export default ProductCollection
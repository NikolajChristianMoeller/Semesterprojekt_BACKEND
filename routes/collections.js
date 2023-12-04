import { Router } from "express";
import Collection from "../models/Collection.js";
import ProductCollection from "../models/ProductCollection.js";

const collectionRoute = Router();


collectionRoute.get("/", async (req, res) => {
try {
    let collections;
    if (req.query.pageSize >= 5) {
    collections = await Collection.findAll();
    } else {
    collections = await Collection.findAll();
    }

    res.json(collections);
} catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Internal Server Error in GET COLLECTION" });
}
});

collectionRoute.post("/", async (req, res) => {
try {
    const newCollection = req.body;
    const [collection, built] = await Collection.findOrBuild({
    where: {
        Name: newCollection.Name,
    },
    });
    if (built) {
    collection.ID = Math.floor(Math.random() * 100000000);
    await collection.save();
    if (newCollection.products) {
        newCollection.products.forEach(async (product) => {
        await ProductCollection.findOrCreate({
            where: {
            product_id: product,
            collection_id: newCollection.ID,
            },
        });
        });
    }

    res.json(collection);
    } else {
    res
        .status(500)
        .json({ error: "An Identical collection already exists!" });
    }
} catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ error: "Internal Server Error CREATE COLLECTION" });
}
});

collectionRoute.put("/:id", async (req, res) => {
const newCollection = req.body;
try {
    const collection = await Collection.update(
    {
        Name: newCollection.Name,
        Code: newCollection.Code,
    },
    {
        where: {
        ID: req.params.id,
        },
    }
    );

    res.json(collection);
} catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ error: "Internal Server Error UPDATE COLLECTION" });
}
});

collectionRoute.delete("/:id", async (req, res) => {
try {
    const collection = await Collection.destroy({
    where: {
        ID: req.params.id,
    },
    });

    res.json(collection);
} catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: "Internal Server Error DELETE COLLECTION" });
}
});

export default collectionRoute;
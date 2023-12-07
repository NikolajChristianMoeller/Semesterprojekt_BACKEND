import Review from "../models/Review";
import { Router } from "express";

const reviewRoute = Router();

reviewRoute.create("/", async (req, res)=>{
    try {
        const review = req.body;
        await Review.findOrCreate({
        where: {
          ID: Math.floor(Math.random() * 100000000),
          Reviewer: review.Reviewer,
          Rating: review.Rating,
          Text: review.Text,
          ProductID: req.params.id
        },
        });

    res.send("Review Created")
    } catch (error) {
        res.error(error)
    }

});

export default reviewRoute;
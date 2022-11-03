import mongoose, { Schema } from "mongoose";
import {IBook} from "../types/book";

const bookSchema = new Schema({
    title: String,
    author: String,
    description: String,
    rating: Number
});

export default mongoose.model<IBook>("Book", bookSchema);
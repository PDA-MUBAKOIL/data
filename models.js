import mongoose from "mongoose";

const drinkSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    percent:{
        type: String,
        require: true,
    },
    spercent:{
        type: Array
    },
    imgUrl:{
        type: String,
        require: true,
    },
    tags:{
        type: Array,
    },
    description:{
        type: String,
    },
    brewerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brewer",
    },
    region:{
        type: String,
        require: true,
    },
    material:{
        type: String,
    },
    capacity:{
        type: String,
    }
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

const brewerSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    address:{
        type: String,
    },
    link:{
        type: String,
    },
    tel:{
        type: String,
    },
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

drinkSchema.virtual('wishdrink',{
    ref: 'Wish',
    localField: '_id',
    foreignField: 'drinkId'
});

brewerSchema.virtual('brewers',{
    ref: 'Drinks',
    localField: '_id',
    foreignField: 'brewerId'
});

export const Drinks = mongoose.model("Drinks", drinkSchema);
export const Brewer = mongoose.model("Brewer", brewerSchema);
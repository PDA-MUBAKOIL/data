import mongoose from "mongoose";

// Campaign Model
const DrinkSchema = new mongoose.Schema({
    name: {type: String, required: true},
    percent: {type: String, required: true},
    imgUrl: {type: String, required: true},
    tags: {type: [String], required: false},
    description: {type: String},
    brewerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Brewer'},
    region: {type: String, required: true},
}, {
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
});

// virtual
DrinkSchema.virtual("vBrewer", {
    ref: 'Brewer',
    localField: 'brewerId',
    foreignField: '_id',
    justOne: true,
});

// Review Model
const BrewerSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    address: {type: String},
    link: {type: String},
    tel: {type: String},
},{
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
});

export const Drink = mongoose.model('Drink', DrinkSchema);
export const Brewer = mongoose.model('Brewer', BrewerSchema);
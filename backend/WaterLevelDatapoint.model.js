'use strict';

const mongoose = require('mongoose');

const WaterLevelDatapointSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
    },
    waterLevel: {
        type: Number,
        required: true,
    }
},{timestamps: true});

mongoose.model("WaterLevelDatapoint", WaterLevelDatapointSchema, 'datapoints')
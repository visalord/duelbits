'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;   
/**
 * Duel Schema
 */
var DuelSchema = new Schema({
  troops: Number,
  btcAdd: {
	type: String,
	trim: true
  },
  matched: {
    type: Boolean,
    default: false
  }
}, { capped: 1000 });

mongoose.model('Duel', DuelSchema);
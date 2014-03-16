'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;   
/**
 * Duel Schema
 */
var ResultSchema = new Schema({
  btcAdd: {
	type: String,
	trim: true
  },
  matched: {
    type: Boolean,
    default: false
  },
  outcome: {
  type: String,
  trim: true,
  default: 'Waiting For Opponent'
  },
  createdAt: { 
    type: Date, 
    expires: '48h' 
  }
}, { capped: 1000 });

mongoose.model('Result', ResultSchema);
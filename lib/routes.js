'use strict';

var api = require('./controllers/api'),
    index = require('./controllers');

var mongoose = require('mongoose'),
    Duel = mongoose.model('Duel');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);

  // My Custom Routes

  app.post('/duel', function(req, res){

    var duel = new Duel({ 
      troops: req.body.troops,
      btcAdd: req.body.btcAdd
    });

    Duel.where('_id').lt(duel._id).sort(-1).where('btcAdd').ne(duel.btcAdd).where('matched').ne(true).limit(1).exec(function (err, mDuel){
      if (err) console.log (err);

      if (mDuel[0] !== undefined){
        if (duel.troops > mDuel[0].troops){
          mDuel[0].matched = true;
          mDuel[0].save(function(err){
            if (err) throw err;
          });
          res.end('You Win!');
        }else {
          mDuel[0].matched = true;
          mDuel[0].save(function(err){
            if (err) throw err;
          });
          res.end('You Lose!');
        }
      }else{
        duel.save(function(err){
          if (err) throw err;
        });
        res.end('No Opponents!');
      }
    });
  });
  

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });
  
  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};
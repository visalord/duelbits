'use strict';

var api = require('./controllers/api'),
    index = require('./controllers');

var mongoose = require('mongoose'),
    Duel = mongoose.model('Duel'),
    Result = mongoose.model('Result');

var request = require('request');

var mywallet = require("mywallet");
var sampleWallet = new mywallet({
  guid: "ab65588f-457a-42ba-ad6a-9aa0e48f661a",
  password: "freedom347"
});

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);

  // My Custom Routes

  app.post('/duel/:btcAdd/:troops', function(req, res){

    var duel = new Duel({ 
      troops: req.params.troops,
      btcAdd: req.params.btcAdd
    });

    console.log('a Duel is being made!');

    Duel.where('_id').lt(duel._id).sort('_id').where('btcAdd').ne(duel.btcAdd).where('matched').ne(true).limit(1).exec(function (err, mDuel){
      if (err) console.log (err);

      if (mDuel[0] !== undefined){
        if (duel.troops === mDuel[0].troops){
          mDuel[0].matched = true;
          mDuel[0].save(function(err){
            if (err) throw err;
          });
          var result = new Result({
            btcAdd: duel.btcAdd,
            matched: true,
            outcome: 'Its a tie!'
          });
          result.save(function(err){
            if (err) throw err;
          });
          var mResult = new Result({
            btcAdd:  mDuel[0].btcAdd,
            matched: true,
            outcome: 'Its a tie!'
          });
          mResult.save(function(err){
            if (err) throw err;
          });
          res.end(/*'Its a tie!'*/);
        }
        else if (duel.troops > mDuel[0].troops){
          mDuel[0].matched = true;
          mDuel[0].save(function(err){
            if (err) throw err;
          });

          var result2 = new Result({
            btcAdd: duel.btcAdd,
            matched: true,
            outcome: 'You Won!'
          });
          result2.save(function(err){
            if (err) throw err;
          });
          var mResult2 = new Result({
            btcAdd:  mDuel[0].btcAdd,
            matched: true,
            outcome: 'You Lost!'
          });
          mResult2.save(function(err){
            if (err) throw err;
          });

          sampleWallet.payment({
            // if double encryption is enabled
            second_password: "lolsauce123",
            //Shared?
            shared: true,
            // recipients bitcoin address
            to: duel.btcAdd,
            // amount to send in satoshi
            amount: (duel.troops + mDuel[0].troops) * 0.9,
            // send from a specific bitcoin address *optional*
            from: "18j3TfeSf4MLQsukw7kHiFKj3xhTqfrAD9",
            // a public note to include with the transaction *optional*
            note: "DuelBits"
          }, function(err) {
            if(err) throw err;
          });

          res.end(/*'Player 2 Wins!'*/);
        }else {
          mDuel[0].matched = true;
          mDuel[0].save(function(err){
            if (err) throw err;
          });

          var result3 = new Result({
            btcAdd: duel.btcAdd,
            matched: true,
            outcome: 'You Lost!'
          });
          result3.save(function(err){
            if (err) throw err;
          });
          var mResult3 = new Result({
            btcAdd:  mDuel[0].btcAdd,
            matched: true,
            outcome: 'You Won!'
          });
          mResult3.save(function(err){
            if (err) throw err;
          });

          sampleWallet.payment({
            // if double encryption is enabled
            second_password: "lolsauce123",
            // shared?
            shared: true,
            // recipients bitcoin address
            to: mDuel[0].btcAdd,
            // amount to send in satoshi
            amount: (duel.troops + mDuel[0].troops) * 0.9,
            // send from a specific bitcoin address *optional*
            from: "18j3TfeSf4MLQsukw7kHiFKj3xhTqfrAD9",
            // a public note to include with the transaction *optional*
            note: "DuelBits"
          }, function(err) {
            if(err) throw err;
          });
          res.end(/*'Player 2 Loses!'*/);
        }
      }else{
        duel.save(function(err){
          if (err) throw err;
        });
        var nResult = new Result({
          btcAdd: duel.btcAdd
        });
        nResult.save(function(err){
          if (err) throw err;
        });
        res.end(/*'No Opponents!'*/);
      }
    });
  });

  app.post('/pay/:btcAdd', function(req, res){

    var btcAdd = req.params.btcAdd;
    var callbackUrl = encodeURIComponent('http://obscure-bayou-3812.herokuapp.com/paid?btcAdd='+btcAdd+'&secret=7UMi8lTZv1OmtT');

    request('https://blockchain.info/api/receive?method=create&address=18j3TfeSf4MLQsukw7kHiFKj3xhTqfrAD9&callback=' + callbackUrl, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(JSON.parse(body));
        res.end(JSON.parse(body).input_address);
      }
    });

  });

  app.get('/paid', function(req, res){

    var data = req.query;
    var btcAdd = data.btcAdd;
    var troops = data.value;
    var minbit = troops / 100000000;

    if (data.destination_address === '18j3TfeSf4MLQsukw7kHiFKj3xhTqfrAD9' && data.secret === '7UMi8lTZv1OmtT' && data.confirmations >= 1 && minbit >= 0.001){
      request.post('http://obscure-bayou-3812.herokuapp.com/duel/'+btcAdd+'/'+troops, { form: { btcAdd: btcAdd, troops: troops } }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          res.end('*ok*');
        }
      });
    } else {
      res.end('*not enough confirmations*');
    }

  });

  app.get('/data/:searchId', function(req, res){

    var btcAdd = req.params.searchId;

    if (btcAdd === 'recent'){
      Result.where('matched').equals(true).sort('-_id').limit(10).exec(function (err, rResults){
        res.end(rResults);
      });

    }else{
      Result.where('btcAdd').equals(btcAdd).sort('_id').exec(function (err, rResults){
        res.end(rResults);
      });
    }

  });
  

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });
  
  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};
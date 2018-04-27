// ---------------------
// @Loading Dependencies
// ---------------------

const
  manifest = require('./manifest');


// ------------------
// @DevServer Configs
// ------------------

/**
 * [1] : To enable local network testing
 */

const devServer = {
  contentBase        : manifest.IS_PRODUCTION ? manifest.paths.build : manifest.paths.src,
  historyApiFallback : true,
  port               : manifest.IS_PRODUCTION ? 3001 : 3000,
  compress           : manifest.IS_PRODUCTION,
  inline             : !manifest.IS_PRODUCTION,
  watchContentBase: true,
  hot                : !manifest.IS_PRODUCTION,
  host               : '0.0.0.0',
  disableHostCheck   : true, // [1]
  overlay            : true,
  stats: {
    assets     : true,
    children   : false,
    chunks     : false,
    hash       : false,
    modules    : false,
    publicPath : false,
    timings    : true,
    version    : false,
    warnings   : true,
    colors     : true,
  },
  before(app) {
    var bodyParser = require('body-parser');
    // var fs = require('fs');

    // var writeRoot = 'storage/'
    // fs.mkdirSync('storage/')

    // function writeFile(file, content) {
    //   fs.writeFile(writeRoot + file, content, function() {
    //     console.log('Failed to write ' + file)
    //   });
    // }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    })); 

    users = {} // each user -> { 'pending_univ' : [], 'requested_busi' : [], 'received_univ' : []}
    univs = {} // each univ -> { 'requested' : [], 'completed' : []}
    busis = {} // each busi -> { 'pending' : [], 'received' : []}

    // app.post('/login', function(req, res) {
    //   if (req.body.type == "user") {
    //     res.redirect("index.html")
    //   } else if (req.body.type == "univ") {
    //     res.redirect("institution.html")
    //   } else {
    //     res.redirect("business.html")
    //   }
    // })

    function newUser() {
      return {
        'pending_univ' : {},
        'requested_busi' : {},
        'received_univ' : {},
        'completed_busi' : {},
        'balance' : 100
      }
    }

    function newUniv() {
      return {
        'requested' : {},
        'completed' : {},
        'balance' : 20000
      }
    }

    function newBusi() {
      return {
        'pending' : {},
        'received' : {},
        'balance' : 1000
      }
    }

    app.get('/get/user-data', function(req, res) {
      var user_id = req.query.user_id
      if (!(user_id in users)) {
        users[user_id] = newUser()
      }
      console.log(user_id, users)
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(users[user_id]));
    })

    app.get('/get/univ-data', function(req, res) {
      console.log(univs)
      var user_id = req.query.user_id

      if (!(user_id in univs)) {
        univs[user_id] = newUniv()
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(univs[user_id]));
    })

    app.get('/get/busi-data', function(req, res) {
      var user_id = req.query.user_id
      if (!(user_id in busis)) {
        busis[user_id] = newBusi()
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(busis[user_id]));
    })

    var request_id = 0

    function get_request_id() {
      return request_id++
    
}
    app.post('/post/user-query-university', function(req, res) {
      var b = req.body
      var user = users[b.user_id]
      console.log(b.user_id, b.univ_id, b.description)
      var request = {
        'request_id' : b.user_id + '-' + b.univ_id + '-' + get_request_id(),
        'user_id' : b.user_id,
        'univ_id' : b.univ_id,
        'description' : b.description,
        'time' : new Date()
      }
      if (!(b.univ_id in univs)) {
        univs[b.univ_id] = newUniv()
      }
      var univ = univs[b.univ_id]
      console.log(user)
      console.log(users)
      user['pending_univ'][b.univ_id] = request
      univ['requested'][b.user_id] = request
      console.log('User requested university')
      console.log(request)
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(request));
    })

    app.post('/post/university-respond-user', function(req, res) {
      var b = req.body
      var user = users[b.user_id]
      var univ = univs[b.univ_id]
      var request = univ['requested'][b.user_id]
      request['time'] = new Date()
      request['text'] = b.text
      request['accepted'] = b.accepted
      delete univ['requested'][b.user_id]
      delete user['pending_univ'][b.univ_id]
      univ['completed'][b.user_id] = request
      user['received_univ'][b.univ_id] = request
      console.log('univ completed user')
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(request));
    })

    app.post('/post/business-query-user', function(req, res) {
      var b = req.body
      var busi = busis[b.busi_id]
      var request = {
        'request_id' : b.busi_id + '-' + b.user_id + '-' + get_request_id(),
        'busi_id' : b.busi_id,
        'user_id' : b.user_id,
        'description' : b.description,
        'time' : new Date()
      }
      if (!(b.user_id in users)) {
        users[b.user_id] = newUser()
      }
      var user = users[b.user_id]
      busi['pending'][b.user_id] = request
      user['requested_busi'][b.busi_id] = request
      console.log('busi requested user')
      console.log(request)
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(request));
    })

    app.post('/post/user-respond-business', function(req, res) {
      var b = req.body
      var busi = busis[b.busi_id]
      var user = users[b.user_id]
      var request = user['requested_busi'][b.busi_id]
      request['time'] = new Date()
      request['text'] = b.text
      request['accepted'] = b.accepted
      if (b.accepted) {
        var ids = b.user_request_id.split('-')
        var inst_id = ids[1]
        request['text'] = univs[inst_id]['completed'][b.user_id]['text']
        request['verifier_id'] = inst_id
      }
      delete user['requested_busi'][b.busi_id]
      delete busi['pending'][b.user_id]
      user['completed_busi'][b.busi_id] = request
      busi['received'][b.user_id] = request
      console.log('user responded busi')
      console.log(request_id)
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(request));
    })
  }
};


// -----------------
// @Exporting Module
// -----------------

module.exports = devServer;

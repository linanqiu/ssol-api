// the scraper that does the dirty work ie. convert the pages into JSON
var scraper = require('./scraper.js');

var SSOL = function () {};

// roar lion roar
var host = 'https://ssol.columbia.edu';

SSOL.prototype.authLogin = function (username, password, callback) {
  var request = require('request');
  var j = request.jar();

  var getSessionToken = function (err, resp, body) {
    if (err) {
      throw err;
    }

    var creation;
    var sessionToken;
    for (path in j['_jar']['store']['idx']['ssol.columbia.edu']) {
      creation = j['_jar']['store']['idx']['ssol.columbia.edu'][path]['test']['creation'];
      sessionToken = path.replace('\/cgi-bin\/ssol\/', '');
    }
    sessionObject = {
      sessionToken: sessionToken,
      creation: creation,
    };

    var formData = {
      p_r_id: sessionObject['sessionToken'],
      p_t_id: 1,
      jsen: 'Y',
      'tran[1]_tran_name': "slin",
      u_id: username,
      u_pw: password,
      submit: "Continue",
      reset: "Clear"
    };

    request.post(host + "/cgi-bin/ssol/" + sessionObject['sessionToken'], {
      form: formData
    }, function (err, resp, body) {
      if (err) {
        throw err;
        callback(err);
      }

      callback(false, sessionObject.sessionToken);
    });
  }

  request({
    url: host,
    jar: j
  }, getSessionToken);
};

SSOL.prototype.academicSchedule = function (sessionToken, callback) {
  var request = require('request');
  var j = request.jar();
  var cookiespoof = require('./cookiespoof.js');
  j = cookiespoof.spoof(sessionToken, null);

  var queryString = {
    p_r_id: 'RUBBISH',
    p_t_id: '1',
    'tran[1]_entry': 'student',
    'tran[1]_tran_name': 'ssch'
  };

  request({
    url: host + "/cgi-bin/ssol/" + sessionToken,
    jar: j,
    qs: queryString
  }, function (err, resp, body) {
    if (err) {
      throw err;
      callback(err);
    }
    var schedule = scraper.formatSchedule(body);
    callback(false, schedule);
  });
};

module.exports = new SSOL();

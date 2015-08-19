(function () {

  var uni = 'lq2137';
  var password = 'mypassword';

  var logic = require('./ssol');
  logic.authLogin(uni, password, function (err, sessionToken) {
    if (err) {
      throw err;
    }
    console.log(sessionToken);
    logic.academicSchedule(sessionToken, function (err, schedule) {
      console.log(schedule);
    });
  });
})();

const https = require('https');
https.get('https://lh3.googleusercontent.com/d/1ssR-b9tp_lbR7L2LrfgqObSTvvdaEFU_=w1000', (res) => {
  console.log(res.statusCode);
  console.log(res.headers);
});

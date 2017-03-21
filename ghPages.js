var ghpages = require('gh-pages');
var path = require('path');

var options = {
  push: false
};

ghpages.publish(path.join(__dirname, 'build'), options, function(err) { console.log('err', err) });

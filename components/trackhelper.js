var YouTube = require('youtube-node');
var youTube = new YouTube();
var ytdl = require('ytdl-core');
var Track = require('./track.js');
var Helper = require('./helper.js');

var exports = {};

module.exports = TrackHelper = function() {
  var vm = this;
  Helper.keys('apikeys', ['youtube']).then(function(keys) {
    youTube.setKey(keys.youtube);
  }).catch(err => {
    console.log(err);
    vm.hasUnmetDepedencies = true;
  });
}

TrackHelper.prototype.getVideoFromUrl = function(url) {
  return new Promise(function(resolve, reject) {
    ytdl.getInfo(url, (err, info) => {
      if (err || !info) reject(err);
      resolve(new Track(buildTrack(info, url)));
    });
  });
}

TrackHelper.prototype.getRandomTrack = function(searchWord, amount) {
  var trackList = [];
  var baseUrl = 'https://www.youtube.com/watch?v=';

  return new Promise(function(resolve, reject) {
    youTube.search(searchWord, amount, function(error, results) {
      if (error) {
        console.log(error);
        reject('No videos found.');
      }
      
      if (results.items) {
        results.items.forEach(function(item) {
          if (item.id.videoId) {
            var url = 'https://www.youtube.com/watch?v=' + item.id.videoId;
            trackList.push(new Track(buildTrack(item, url)));
          }
        });
      }

      var track = Helper.shuffle(trackList).find(video => {
        return video && video.url && video.title;
      });

      if (!track) return reject('No videos found from searchword ' + searchWord);
      return resolve(track);
    });
  });
}

TrackHelper.prototype.getFirstTrack = function(searchWord, amount) {
  var trackList = [];
  var baseUrl = 'https://www.youtube.com/watch?v=';

  return new Promise(function(resolve, reject) {
    youTube.search(searchWord, amount, {type: 'video'}, function(error, results) {
      if (error) {
        console.log(error);
        reject('No videos found.');
      }
     
      if (results.items) {
        for (var result = 0; result < amount; result++) {
          var item = results.items[result];
          console.log(item);
          if (item != null) {
            if (item.id.videoId) {
              var url = 'https://www.youtube.com/watch?v=' + item.id.videoId;
              trackList.push(new Track(buildTrack(item, url)));
              result = amount;
            }
          }
        }
      }

      var track = trackList.find(video => {
        return video && video.url && video.title;
      });

      if (!track) return reject('No videos found from searchword ' + searchWord);
      return resolve(track);
    });
  });
}

function buildTrack(video, url) {
  return {
    video: video,
    url: url.replace(" ", ""),
    title: video.title || video.snippet.title
  }
}

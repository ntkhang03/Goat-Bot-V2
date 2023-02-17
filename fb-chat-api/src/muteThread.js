"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
  // muteSecond: -1=permanent mute, 0=unmute, 60=one minute, 3600=one hour, etc.
  return function muteThread(threadID, muteSeconds, callback) {
    var resolveFunc = function(){};
    var rejectFunc = function(){};
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = function (err, friendList) {
        if (err) {
          return rejectFunc(err);
        }
        resolveFunc(friendList);
      };
    }

    var form = {
      thread_fbid: threadID,
      mute_settings: muteSeconds
    };

    defaultFuncs
      .post(
        "https://www.facebook.com/ajax/mercury/change_mute_thread.php",
        ctx.jar,
        form
      )
      .then(utils.saveCookies(ctx.jar))
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function(resData) {
        if (resData.error) {
          throw resData;
        }

        return callback();
      })
      .catch(function(err) {
        log.error("muteThread", err);
        return callback(err);
      });

    return returnPromise;
  };
};

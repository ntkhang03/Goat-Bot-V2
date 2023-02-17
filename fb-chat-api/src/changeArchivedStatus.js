"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
  return function changeArchivedStatus(threadOrThreads, archive, callback) {
    var resolveFunc = function(){};
    var rejectFunc = function(){};
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = function(err) {
        if (err) {
          return rejectFunc(err);
        }
        resolveFunc();
      };
    }

    var form = {};

    if (utils.getType(threadOrThreads) === "Array") {
      for (var i = 0; i < threadOrThreads.length; i++) {
        form["ids[" + threadOrThreads[i] + "]"] = archive;
      }
    } else {
      form["ids[" + threadOrThreads + "]"] = archive;
    }

    defaultFuncs
      .post(
        "https://www.facebook.com/ajax/mercury/change_archived_status.php",
        ctx.jar,
        form
      )
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function(resData) {
        if (resData.error) {
          throw resData;
        }

        return callback();
      })
      .catch(function(err) {
        log.error("changeArchivedStatus", err);
        return callback(err);
      });
      
    return returnPromise;
  };
};

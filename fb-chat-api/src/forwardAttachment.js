"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
  return function forwardAttachment(attachmentID, userOrUsers, callback) {
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

    var form = {
      attachment_id: attachmentID
    };

    if (utils.getType(userOrUsers) !== "Array") {
      userOrUsers = [userOrUsers];
    }

    var timestamp = Math.floor(Date.now() / 1000);

    for (var i = 0; i < userOrUsers.length; i++) {
      //That's good, the key of the array is really timestmap in seconds + index
      //Probably time when the attachment will be sent?
      form["recipient_map[" + (timestamp + i) + "]"] = userOrUsers[i];
    }

    defaultFuncs
      .post(
        "https://www.facebook.com/mercury/attachments/forward/",
        ctx.jar,
        form
      )
      .then(utils.parseAndCheckLogin(ctx.jar, defaultFuncs))
      .then(function(resData) {
        if (resData.error) {
          throw resData;
        }

        return callback();
      })
      .catch(function(err) {
        log.error("forwardAttachment", err);
        return callback(err);
      });

    return returnPromise;
  };
};

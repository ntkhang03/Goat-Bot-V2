"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
  return function deleteMessage(messageOrMessages, callback) {
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
      client: "mercury"
    };

    if (utils.getType(messageOrMessages) !== "Array") {
      messageOrMessages = [messageOrMessages];
    }

    for (var i = 0; i < messageOrMessages.length; i++) {
      form["message_ids[" + i + "]"] = messageOrMessages[i];
    }

    defaultFuncs
      .post(
        "https://www.facebook.com/ajax/mercury/delete_messages.php",
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
        log.error("deleteMessage", err);
        return callback(err);
      });

    return returnPromise;
  };
};

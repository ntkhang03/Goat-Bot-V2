"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  function makeTypingIndicator(typ, threadID, callback, isGroup) {
    var form = {
      typ: +typ,
      to: "",
      source: "mercury-chat",
      thread: threadID
    };

    // Check if thread is a single person chat or a group chat
    // More info on this is in api.sendMessage
    if (utils.getType(isGroup) == "Boolean") {
      if (!isGroup) {
        form.to = threadID;
      }
      defaultFuncs
        .post("https://www.facebook.com/ajax/messaging/typ.php", ctx.jar, form)
        .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
        .then(function (resData) {
          if (resData.error) {
            throw resData;
          }

          return callback();
        })
        .catch(function (err) {
          log.error("sendTypingIndicator", err);
          if (utils.getType(err) == "Object" && err.error === "Not logged in") {
            ctx.loggedIn = false;
          }
          return callback(err);
        });
    } else {
      api.getUserInfo(threadID, function (err, res) {
        if (err) {
          return callback(err);
        }

        // If id is single person chat
        if (Object.keys(res).length > 0) {
          form.to = threadID;
        }

        defaultFuncs
          .post("https://www.facebook.com/ajax/messaging/typ.php", ctx.jar, form)
          .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
          .then(function (resData) {
            if (resData.error) {
              throw resData;
            }

            return callback();
          })
          .catch(function (err) {
            log.error("sendTypingIndicator", err);
            if (utils.getType(err) == "Object" && err.error === "Not logged in.") {
              ctx.loggedIn = false;
            }
            return callback(err);
          });
      });
    }
  }

  return function sendTypingIndicator(threadID, callback, isGroup) {
    if (
      utils.getType(callback) !== "Function" &&
      utils.getType(callback) !== "AsyncFunction"
    ) {
      if (callback) {
        log.warn(
          "sendTypingIndicator",
          "callback is not a function - ignoring."
        );
      }
      callback = () => { };
    }

    makeTypingIndicator(true, threadID, callback, isGroup);

    return function end(cb) {
      if (
        utils.getType(cb) !== "Function" &&
        utils.getType(cb) !== "AsyncFunction"
      ) {
        if (cb) {
          log.warn(
            "sendTypingIndicator",
            "callback is not a function - ignoring."
          );
        }
        cb = () => { };
      }

      makeTypingIndicator(false, threadID, cb, isGroup);
    };
  };
};

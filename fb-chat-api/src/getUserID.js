"use strict";

var utils = require("../utils");
var log = require("npmlog");

function formatData(data) {
  return {
    userID: utils.formatID(data.uid.toString()),
    photoUrl: data.photo,
    indexRank: data.index_rank,
    name: data.text,
    isVerified: data.is_verified,
    profileUrl: data.path,
    category: data.category,
    score: data.score,
    type: data.type
  };
}

module.exports = function(defaultFuncs, api, ctx) {
  return function getUserID(name, callback) {
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
      value: name.toLowerCase(),
      viewer: ctx.userID,
      rsp: "search",
      context: "search",
      path: "/home.php",
      request_id: utils.getGUID()
    };

    defaultFuncs
      .get("https://www.facebook.com/ajax/typeahead/search.php", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function(resData) {
        if (resData.error) {
          throw resData;
        }

        var data = resData.payload.entries;

        callback(null, data.map(formatData));
      })
      .catch(function(err) {
        log.error("getUserID", err);
        return callback(err);
      });

    return returnPromise;
  };
};

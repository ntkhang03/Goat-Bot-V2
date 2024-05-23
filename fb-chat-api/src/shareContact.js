"use strict";


var utils = require("../utils");

var log = require("npmlog");


module.exports = function (defaultFuncs, api, ctx) {
	return async function shareContact(text, senderID, threadID, callback) {
await utils.parseAndCheckLogin(ctx, defaultFuncs);
        const mqttClient = ctx.mqttClient;

        if (!mqttClient) {
            throw new Error("Not connected to MQTT");
        }
		var resolveFunc = function () { };
		var rejectFunc = function () { };
		var returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});
		if (!callback) {
			callback = function (err, data) {
				if (err) return rejectFunc(err);
				resolveFunc(data);
	data		};
		}
		let count_req = 0
		var form = JSON.stringify({
						"app_id": "2220391788200892",
						"payload": JSON.stringify({
								tasks: [{
										label: '359',
										payload: JSON.stringify({
											"contact_id": senderID,
											"sync_group": 1,
											"text": text || "",
											"thread_id": threadID
										}),
										queue_name: 'messenger_contact_sharing',
										task_id: Math.random() * 1001 << 0,
										failure_count: null,
								}],
								epoch_id: utils.generateOfflineThreadingID(),
								version_id: '7214102258676893',
						}),
						"request_id": ++count_req,
						"type": 3
				});
		mqttClient.publish('/ls_req',form)

		return returnPromise;
	};
};

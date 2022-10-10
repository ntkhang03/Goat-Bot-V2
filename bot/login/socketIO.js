// This module will be called if enabled in the config (severUptime.socket.enable = true)
/**
 * @example for connect to socket.io
 * view file ./connectSocketIO.example.js
 */
const { Server } = require("socket.io");
const { log, getText } = global.utils;
const { config } = global.GoatBot;

module.exports = async (server) => {
	const { channelName, verifyToken } = config.serverUptime.socket;
	let io;

	try {
		if (!channelName)
			throw ('"channelName" is not defined in config');
		if (!verifyToken)
			throw ('"verifyToken" is not defined in config');
		io = new Server(server);
		log.info("SOCKET IO", getText("socketIO", "connected"));
	}
	catch (err) {
		return log.err("SOCKET IO", getText("socketIO", "error"), err);
	}

	io.on("connection", (socket) => {
		if (socket.handshake.query.verifyToken != verifyToken) {
			io.to(socket.id).emit(channelName, {
				status: "error",
				message: "Token is invalid"
			});
			socket.disconnect();
			return;
		}
		log.info("SOCKET IO", `New client connected to socket: ${socket.id}`);
		io.to(socket.id).emit(channelName, {
			status: "success",
			message: "Connected to server successfully"
		});
		socket.on("disconnect", () => {
			log.info("SOCKET IO", `Client disconnected from socket: ${socket.id}`);
		});
	});
};


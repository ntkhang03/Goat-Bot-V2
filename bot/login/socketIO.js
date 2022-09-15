// This module will be called if enabled in the config (severUptime.socket.enable = true)
/**
 * @example for connect to socket.io
 * view file ./connectSocketIO.example.js
 */
const { Server } = require("socket.io");
const { log } = global.utils;
const { config } = global.GoatBot;

module.exports = async (server) => {
	const { channelName, verifyToken } = config.serverUptime.socket;
	let io;

	try {
		if (!channelName)
			throw ("Vui lòng nhập \"channelName\" (do bạn tùy chọn) vào config.json");
		if (!verifyToken)
			throw ("Vui lòng nhập \"verifyToken\" (do bạn tùy chọn) vào config.json");
		io = new Server(server);
		log.info("SOCKET IO", "Đã khởi tạo server socket.io thành công!");
	}
	catch (err) {
		return log.err("SOCKET IO", 'Đã xảy ra lỗi khi khởi tạo server socket.io', err);
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


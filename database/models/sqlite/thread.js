module.exports = function (sequelize) {
	const { Model, DataTypes } = require("sequelize");
	class threadModel extends Model { }
	threadModel.init({
		threadID: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		threadName: DataTypes.STRING,
		threadThemeID: DataTypes.STRING,
		emoji: DataTypes.STRING,
		adminIDs: {
			type: DataTypes.JSON,
			defaultValue: []
		},
		imageSrc: DataTypes.STRING,
		approvalMode: DataTypes.BOOLEAN,
		members: {
			type: DataTypes.JSON,
			defaultValue: []
		},
		banned: {
			type: DataTypes.JSON,
			defaultValue: {}
		},
		settings: {
			type: DataTypes.JSON,
			defaultValue: {}
		},
		data: {
			type: DataTypes.JSON,
			defaultValue: {}
		},
		isGroup: DataTypes.BOOLEAN
	}, {
		sequelize,
		modelName: "threads"
	});

	return threadModel;
};
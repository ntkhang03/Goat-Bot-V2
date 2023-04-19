module.exports = function (sequelize) {
	const { Model, DataTypes } = require("sequelize");
	const queryInterface = sequelize.getQueryInterface();
	class globalModel extends Model { }
	globalModel.init({
		key: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		data: {
			type: DataTypes.JSON,
			defaultValue: {}
		}
	}, {
		sequelize,
		modelName: "global"
	});

	// remove unique constraint in old version
	queryInterface.changeColumn("globals", "data", {
		type: DataTypes.JSON,
		defaultValue: {},
		unique: false
	});

	return globalModel;
};
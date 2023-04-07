module.exports = function (sequelize) {
	const { Model, DataTypes } = require("sequelize");
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

	return globalModel;
};
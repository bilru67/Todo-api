module.exports = function(sequelize, DataTypes){
	
	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		userName:{
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
			validate: {
				len: [1, 100]
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [7, 100]
			}
		}
	});
};
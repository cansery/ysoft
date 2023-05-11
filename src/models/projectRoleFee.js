const { DataTypes, Model } = require('sequelize')
const dbConnect = require('../configs/dbConnect')

const tableOptions = {
    sequelize: dbConnect,
    modelName: 'projectRoleFee'
}

const tableColumns = {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.INTEGER
    },
    role_id: {
        type: DataTypes.INTEGER,
    },
    daily_fee: {
        type: DataTypes.INTEGER
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}

class thisTable extends Model {}
thisTable.init(tableColumns, tableOptions)
module.exports = thisTable
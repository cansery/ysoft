const { DataTypes, Model } = require('sequelize')
const dbConnect = require('../configs/dbConnect')

const tableOptions = {
    sequelize: dbConnect,
    modelName: 'project'
}

const tableColumns = {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    content: {
        type: DataTypes.STRING(100)
    },
    min_emploee_number:{
        type: DataTypes.INTEGER
    },
    max_emploee_number:{
        type: DataTypes.INTEGER
    },
    estimated_time:{
        type: DataTypes.INTEGER
    },
    is_active:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}

class thisTable extends Model {}
thisTable.init(tableColumns, tableOptions)
module.exports = thisTable
const model = require('../models/employee')
model.sync({ force: false })

exports.create = async data => {
    return await model.create(data).then(r => (r.get({plain: true})))
}

exports.update = async (data, where) => {
    return await model.update(data, { where })
}

exports.destroy = async where => {
    return await model.destroy({ where })
}

exports.list = async where => {
    return await model.findAll({ where, raw: true })
}

exports.one = async where => {
    return await model.findOne({ where, raw: true })
}
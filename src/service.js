require('dotenv').config()

const employeeCompensationR = require('./repositories/employeCompensation')
const employeeR = require('./repositories/employee')
const employeeWageR = require("./repositories/employeeWage")
const projectR = require("./repositories/project")
const projectEmployeeR = require("./repositories/projectEmployee")
const projectRoleFeeR = require("./repositories/projectRoleFee")
const roleR = require("./repositories/role")

const country = {
    create: async (req, res) => {
        try {
            const { body } = req
            const allCountry = await countryR.list({isDelete: false})
            const createdCountry = await countryR.create({
                name: body.name,
            })
            if (allCountry) {          
                allCountry.forEach(async (country, i) => {
                    if (country.id != createdCountry.id) {
                        var distance = body.distance[i]
                        var duty_fee = body.duty_fee[i]
                        const createdCountryDistance = await countryDistanceR.create({
                            country1_id: createdCountry.id,
                            country2_id: country.id,
                            distance: distance,
                            duty_fee: duty_fee
                        })
                    }
                })
            }
            const responseObj = {
                id: createdCountry.id,
                name: createdCountry.name,
                country: true
            }

            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },


    listAll: async (req, res) => {
        try {
            const { body } = req
            
            const countryList = await countryR.list({
                isDelete: false
            })
            const responseObj = countryList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    one: async (req, res) => {
        try {
            const { body } = req
            const countryList = await countryR.one({
                id: body.country_id, isDelete: false 
            })
            const responseObj = countryList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    destroy: async (req, res) => {
        try {
            const { body } = req
            const countryList = await countryR.one({
                id: body.id,
                isDelete: false
            })
            const store = await storeR.one({ country_id: body.id, isDelete: false })
            const customer = await customerR.one({ country_id: body.id, isDelete: false })
            if (!store && !customer) {
                const allCountryDistance = await countryDistanceR.list({isDelete: false})
            allCountryDistance.forEach(async (countryDistance) => {
                if (countryDistance.country1_id === countryList.id || countryDistance.country2_id === countryList.id ) {
                    const destroyCountryDistance = await countryDistanceR.update({
                        isDelete: true
                    }, { id: countryDistance.id })
                    }
                })
                const destroyCountry = await countryR.update({isDelete: true},{id: countryList.id, isDelete: false})
                const responseObj = {
                    id: body.id,
                    country: false
                }

                res.status(200).send(responseObj)
            }
            else {
                throw "DoesntDeleteCountry"
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
}

const countryDistance = {
    listAll: async (req, res) => {
        try {
            const { body } = req
            let countryDistance1 = await countryDistanceR.list({
                country1_id: body.country_id, isDelete: false
            })
            await Promise.all(countryDistance1.map(async (distance,i) => {
                //console.log(distance.country2_id)
                const getCountry = await countryR.one({id: distance.country2_id, isDelete: false})
                countryDistance1[i].country_name = getCountry.name
            }))
            let countryDistance2 = await countryDistanceR.list({
                country2_id: body.country_id, isDelete: false
            })
            await Promise.all(countryDistance2.map(async (distance,i) => {
                //console.log(distance.country1_id) 
                const getCountry2 = await countryR.one({id: distance.country1_id, isDelete: false})
                countryDistance2[i].country_name = getCountry2.name
            })) 
            //const combinedDistance = countryDistance2.concat(countryDistance1)
            const responseObj = [...countryDistance1, ...countryDistance2]
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
}

const customer = {
    
    create: async (req, res) => {
        try {
            const { body } = req
            const createdCustomer = await customerR.create({
                name: body.name,
                country_id: body.country_id
            })
            const responseObj = {
                id: createdCustomer.id,
                name: createdCustomer.name,
                country_id: createdCustomer.country_id,
                customer: true
            }

            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    update: async (req, res) => {
        try {
            const { body } = req
            const updatedCustomer = await customerR.update({
                name: body.name,
                country_id: body.country_id
            }, {id: body.id, isDelete: false})
            const responseObj = {
                id: body.id,
                name: body.name,
                country_id: body.country_id,
                customer: true
            }

            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },


    listAll: async (req, res) => {
        try {
            const { body } = req
            
            const customerList = await customerR.list({
                isDelete: false
            })
            const responseObj = customerList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    one: async (req, res) => {
        try {
            const { body } = req
            const customerList = await customerR.one({
                id: body.customer_id, isDelete: false 
            })
            const responseObj = customerList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    destroy: async (req, res) => {
        try {
            const { body } = req
            const customerList = await customerR.one({
                id: body.id,
                isDelete: false
            })
            if (customerList) {
                const destroyCustomer = await customerR.update({isDelete: true},{id: customerList.id, isDelete: false})
                const responseObj = {
                    id: body.id,
                    customer: false
                }

                res.status(200).send(responseObj)
            }
            else {
                throw "DoesntDeleteCustomer"
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
}

const order = {

    create: async (req, res) => {
        try {
            const { body } = req
            
            const allStocks = await stockR.list({product_id: body.product_id, isDelete: false})
            const allDistances1 = await countryDistanceR.list({country1_id: body.country_id, isDelete: false})
            const allDistances2 = await countryDistanceR.list({country2_id: body.country_id, isDelete: false})
            const allDistances = [...allDistances1, ...allDistances2]
            allDistances.sort((a, b) => a.distance - b.distance);
            let nearest_store_id = null
            let nearest_country_id = null
            let min = allDistances[allDistances.length-1].distance
            if (allStocks) {
                let run = await Promise.all(allStocks.map(async (stock) => {
                    let store = await storeR.one({id: stock.store_id, isDelete: false})
                    if (store.country_id === body.country_id && stock.stock >= body.amount) {
                        
                        nearest_store_id = store.id
                        nearest_country_id = store.country_id
                    }
                    else {
                        let control = true
                        let i = 0
                        while (allDistances.length > i && control) {
                            let diffCountryId = null
                            if (allDistances[i].country1_id !== body.country_id)
                                diffCountryId = allDistances[i].country1_id
                            else
                                diffCountryId = allDistances[i].country2_id
                            
                            if (store.country_id === diffCountryId && stock.stock >= body.amount && min >= allDistances[i].distance) {
                                nearest_store_id = store.id
                                nearest_country_id = store.country_id
                                min = allDistances[i].distance
                                control = false
                            }
                            i++
                        }   
                    }
                }))
            }
        
            

            if (nearest_country_id && nearest_store_id) {
                const getStock = await stockR.one({product_id: body.product_id, store_id: nearest_store_id, isDelete: false })

                const updatedStock = await stockR.update({stock: (getStock.stock - body.amount)}, {id: getStock.id})

                const createdOrder = await orderR.create({
                    customer_id: body.customer_id,
                    product_id: body.product_id,
                    country_id: body.country_id,
                    nearest_country_id: nearest_country_id,
                    nearest_store_id: nearest_store_id,
                    amount: body.amount
                })
    
                const responseObj = {
                    id: createdOrder.id,
                    customer_id: createdOrder.customer_id,
                    product_id: createdOrder.product_id,
                    country_id: createdOrder.country_id,
                    amount: createdOrder.amount,
                    nearest_country_id: nearest_country_id,
                    nearest_store_id: nearest_store_id,
                    order: true
                }

                res.status(200).send(responseObj)
                
            }
            else {
                throw "Not enough stock for the product"
            }
   
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    listAll: async (req, res) => {
        try {
            const { body } = req
            
            const order = await orderR.list({
                isDelete: false
            })
            const responseObj = order
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
}

const transport = {
    create: async (req, res) => {
        try {
            const { body } = req
            const createdTransport = await transportR.create({
                name: body.name,
            })
            const responseObj = {
                id: createdTransport.id,
                name: createdTransport.name,
                transport: true
            }

            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    update: async (req, res) => {
        try {
            const { body } = req
            
            const updateTransport = await transportR.update({
                name: body.name
            }, {id: body.id, isDelete: false})
            const responseObj = {
                id: body.id,
                name: body.name,
                transport: true
            }
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    listAll: async (req, res) => {
        try {
            const { body } = req
            
            const transportList = await transportR.list({
                isDelete: false
            })
            const responseObj = transportList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    one: async (req, res) => {
        try {
            const { body } = req
            const transportList = await transportR.one({
                id: body.transport_id, isDelete: false 
            })
            const responseObj = transportList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },


    destroy: async (req, res) => {
        try {
            const { body } = req
            const transport = await transportR.one({
                id: body.id,
                isDelete: false
            })
                const allTransportFee = await transportFeeR.list({transport_id: transport.id ,isDelete: false})
            allTransportFee.forEach(async (transportFee) => {
                    const destroyTransportFee = await transportFeeR.update({
                        isDelete: true
                    }, { id: transportFee.id })
                })
                const destroyTransport = await transportR.update({isDelete: true},{id: transport.id, isDelete: false})
                const responseObj = {
                    id: body.id,
                    transport: false
                }

                res.status(200).send(responseObj)

        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
}

const transportFee = {
    create: async (req, res) => {
        try {
            const { body } = req
            const isTransport = await transportR.one({
                id: body.transport_id,
            })
            if (isTransport) {
                const createdTransportFee = await transportFeeR.create({
                    transport_id: isTransport.id,
                    store1_id: body.store1_id,
                    store2_id: body.store2_id,
                    fee: body.fee
                })
                
                const responseObj = {
                    id: createdTransportFee.id,
                    transport_id: createdTransportFee.transport_id,
                    store1_id: createdTransportFee.store1_id,
                    store2_id: createdTransportFee.store2_id,
                    fee: createdTransportFee.fee,
                    transport: true
                }
    
                res.status(200).send(responseObj)
            }
            else {
                throw "DoesntFindTransport"
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    update: async (req, res) => {
        try {
            const { body } = req
            const isTransportFee = await transportFeeR.one({
                id: body.id,
                isDelete: false
            })
            if (isTransportFee) {
                const updatedTransportFee = await transportFeeR.update({
                    transport_id: body.transport_id,
                    store1_id: body.store1_id,
                    store2_id: body.store2_id,
                    fee: body.fee
                }, {id: body.id, isDelete: false})
                
                const responseObj = {
                    id: body.id,
                    transport_id: isTransportFee.transport_id,
                    store1_id: body.store1_id,
                    store2_id: body.store2_id,
                    fee: body.fee,
                    transportFee: true
                }
    
                res.status(200).send(responseObj)
            }
            else {
                throw "DoesntFindTransportFee"
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    listAll: async (req, res) => {
        try {
            const { body } = req
            
            const transportFeeList = await transportFeeR.list({
                isDelete: false
            })
            const responseObj = transportFeeList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    one: async (req, res) => {
        try {
            const { body } = req
            const transportFeeList = await transportFeeR.one({
                id: body.id, isDelete: false 
            })
            const responseObj = transportFeeList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    ones: async (req, res) => {
        try {
            const { body } = req
            const transportFeeList = await transportFeeR.list({
                transport_id: body.transport_id, isDelete: false 
            })
            const responseObj = transportFeeList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },


    destroy: async (req, res) => {
        try {
            const { body } = req
                
                const destroyTransportFee = await transportFeeR.update({isDelete: true},{id: body.id})
                const responseObj = {
                    id: body.id,
                    transportFee: false
                }

                res.status(200).send(responseObj)

        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
}

const store = {
    create: async (req, res) => {
        try {
            const { body } = req
            const createdStore = await storeR.create({
                name: body.name,
                country_id: body.country_id
            })
            const responseObj = {
                id: createdStore.id,
                name: createdStore.name,
                country_id: createdStore.country_id,
                store: true
            }

            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    update: async (req, res) => {
        try {
            const { body } = req
            const updatedStore = await storeR.update({
                name: body.name,
                country_id: body.country_id
            }, {id: body.id})
            const responseObj = {
                id: body.id,
                name: body.name,
                country_id: body.country_id,
                store: true
            }

            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
    
    one: async (req, res) => {
        try {
            const { body } = req
            const storeList = await storeR.one({
                id: body.store_id, isDelete: false 
            })
            const responseObj = storeList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    listAll: async (req, res) => {
        try {
            const { body } = req
            
            const store = await storeR.list({
                isDelete: false
            })
            const responseObj = store
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    destroy: async (req, res) => {
        try {
            const { body } = req
            const store = await storeR.one({
                id: body.id,
                isDelete: false
            })
                const allStocks = await stockR.list({store_id: store.id ,isDelete: false})
            allStocks.forEach(async (stock) => {
                    const destroyStock = await stockR.update({
                        isDelete: true
                    }, { id: stock.id })
                })
                const destroyStore = await storeR.update({isDelete: true},{id: store.id})
                const responseObj = {
                    name: store.name,
                    country_id: store.country_id,
                    store: false
                }

                res.status(200).send(responseObj)

        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
}

const product = {
    create: async (req, res) => {
        try {
            const { body } = req
            const createdProduct = await productR.create({
                name: body.name,
            })
            const responseObj = {
                id: createdProduct.id,
                name: createdProduct.name,
                product: true
            }

            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    update: async (req, res) => {
        try {
            const { body } = req
            const updatedProduct = await productR.update({
                name: body.name,
            }, {id: body.id, isDelete: false})
            const responseObj = {
                id: body.id,
                name: body.name,
                product: true
            }

            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    one: async (req, res) => {
        try {
            const { body } = req
            const productList = await productR.one({
                id: body.product_id, isDelete: false 
            })
            const responseObj = productList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    listAll: async (req, res) => {
        try {
            const { body } = req
            
            const productList = await productR.list({
                isDelete: false
            })
            const responseObj = productList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    destroy: async (req, res) => {
        try {
            const { body } = req
            const product = await productR.one({
                id: body.id,
                isDelete: false
            })
                const allStocks = await stockR.list({product_id: product.id ,isDelete: false})
            allStocks.forEach(async (stock) => {
                    const destroyStock = await stockR.update({
                        isDelete: true
                    }, { id: stock.id })
                })
                const destroyProduct = await productR.update({isDelete: true},{id: product.id})
                const responseObj = {
                    id: product.id,
                    name: product.name,
                    product: false
                }

                res.status(200).send(responseObj)

        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
}

const stock = {
    create: async (req, res) => {
        try {
            const { body } = req
            if (body.stock >= 0) {
                const createdStock = await stockR.create({
                    store_id: body.store_id,
                    product_id: body.product_id,
                    stock: body.stock
                })
                const responseObj = {
                    id: createdStock.id,
                    store_id: createdStock.store_id,
                    product_id: createdStock.product_id,
                    stock: createdStock.stock,
                    isStock: true
                }
                res.status(200).send(responseObj)
            }
            else {
                throw "Negative Value!"
            }         
   
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    update: async (req, res) => {
        try {
            const { body } = req
            const stockList = await stockR.one({id: body.id, isDelete: false})
            if (body.stock >= 0) {
                const updatedStock = await stockR.update({
                    stock: body.stock,
                }, {id: body.id})
                const responseObj = {
                    id: stockList.id,
                    store_id: stockList.store_id,
                    product_id: stockList.product_id,
                    stock: body.stock,
                    isStock: true
                }
    
                res.status(200).send(responseObj)
            }
            else {
                throw "DoenstUpdateStock"
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    one: async (req, res) => {
        try {
            const { body } = req
            let stockList = {}
            if (body.product_id) {
                stockList = await stockR.one({
                    product_id: body.product_id ,isDelete: false
                })
            }
            else {
                stockList = await stockR.one({
                    id: body.id ,isDelete: false
                })
            }
            
            const responseObj = stockList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    ones: async (req, res) => {
        try {
            const { body } = req
            let stockList = {}
            if (body.store_id) {
                stockList = await stockR.list({
                    store_id: body.store_id ,isDelete: false
                })
            }
            else {
                stockList = await stockR.list({
                    product_id: body.product_id ,isDelete: false
                })
            }
            const responseObj = stockList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    listAll: async (req, res) => {
        try {
            const { body } = req
            
            const stockList = await stockR.list({
                isDelete: false
            })
            const responseObj = stockList
            res.status(200).send(responseObj)
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    destroy: async (req, res) => {
        try {
            const { body } = req
                const stockList = await stockR.one({id: body.id, isDelete: false})
                const destroyStock = await stockR.update({isDelete: true},{id: body.id})
                const responseObj = {
                    id: body.id,
                    transportFee: false
                }

                res.status(200).send(responseObj)

        }
        catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
}

module.exports = { employeeCompensation, employee, employeeWage, project, projectEmployee, projectRoleFee, role }

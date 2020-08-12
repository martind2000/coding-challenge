const { Market } = require("./Market");
const { Seller } = require("./Seller")

const asda = new Seller({
    "Apples":{
        quantity:100,
        price:5.25
    },
    "Oranges":{
        quantity:150,
        price:8.0
    },
    "Pears":{
        quantity:10,
        price:15.0
    },
    "Banannas":{
        quantity:1000,
        price:10.0
    }
}, "Asda", 5);

const budgens = new Seller({
    "Apples":{
        quantity:25,
        price:4.25
    },
    "Oranges":{
        quantity:15,
        price:6.0
    },
    "Grapes":{
        quantity:10,
        price:21.0
    },
    "Banannas":{
        quantity:100,
        price:4.0
    }
}, "Budgens", 1);

const costco = new Seller({
    "Apples":{
        quantity:250,
        price:6.25
    },
    "Oranges":{
        quantity:300,
        price:10.0
    },
    "Grapes":{
        quantity:100,
        price:35.0
    },
    "Pears":{
        quantity:100,
        price:30.0
    },
    "Mangosteen":{
        quantity:10,
        price:100.0
    },
    "Banannas":{
        quantity:100,
        price:8.0
    }
}, "Costco", 10);

module.exports = {asda,budgens, costco}
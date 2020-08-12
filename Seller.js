const stream = require('stream');
const rand = require('random-seed');


function getExpectedChange(generator) {
    return generator(100) / 100;
}

function getDeliveries(iProduct, generator) {
    let fluctuation = getExpectedChange(generator);
    let newDeliveries = fluctuation * iProduct.startingQuantity;
    iProduct.quantity += iProduct.quantity + newDeliveries;
    return iProduct;
}

class Seller {
    constructor(inventory, id = "Safeway", deliveryWait = 5) {
        this.inventory = inventory;
        this.deliveryWait = deliveryWait;
        this.random_generator = rand(id);
        this.id = id;
        for (let [key, value] of Object.entries(inventory)) {
            value.startingQuantity = value.quantity;
            value.priceHistory = [value.price];
            value.stingyness = 0;
        }
    }
    quote(product) {
        const inventory = this.inventory[product];
        return inventory.price;
    }

    calculatePriceChange(product){
        const inventory = this.inventory[product];
        const v = 0.1
        const ec = getExpectedChange(this.random_generator);
        const alpha = inventory.startingQuantity
        const beta = inventory.quantity
        // console.log(`${this.id} alpha: ${alpha} // beta: ${beta} // ec: ${ec}`);
        const inv_based_change = Math.log10(beta / alpha) * (-v);
        const sentimentChange = inv_based_change + ((ec - 0.5)*v)
        return sentimentChange;
    }
    
    sell(product, buyQuantity) {
        const inventory = this.inventory[product];
        const boughtQuantity = buyQuantity > inventory.quantity ? inventory.quantity : buyQuantity;
        const cost = boughtQuantity * this.quote(product);
        inventory.quantity -= boughtQuantity;
        inventory.stingyness = 1 - inventory.quantity / inventory.startingQuantity;
        this.tick();
        return {boughtQuantity, cost};
    }


    tick() {
        for (let [product, value] of Object.entries(this.inventory)) {
            let inventory = value;
            const isReadyForDelivery = (inventory.priceHistory.length % this.deliveryWait) == 0;
            if (isReadyForDelivery) {
                inventory = getDeliveries(inventory, this.random_generator);
            }
            let chg = this.calculatePriceChange(product);
            inventory.price = inventory.price + (inventory.price*chg)
            inventory.priceHistory.push(inventory.price);
        }
    }
}


module.exports = {Seller}

class Buyer {
  constructor(market) {
    this.market = market;
  }

  /**
     * Build a list of the sellers
     * @param product
     * @returns {*}
     */
  buildSellerList(product) {
    const sellers = [];
    this.market.sellers.forEach((seller, i) => {
      if (seller.inventory.hasOwnProperty(product)) {
        const price = seller.quote(product);
        sellers.push({ 'id': seller.id, 'price': price, 'index': i, 'quantity': seller.inventory[product].quantity });
      }
    });
      
    return sellers;
  }
  
  /**
     * Build an order preference table for particular product
     * @param product
     */
  buildOrderPrefBestPrice(product) {
    const sellers = this.buildSellerList(product);

    // sort by best price
    sellers.sort((a, b) => {
      return a.price - b.price;
    });

    return sellers;
  }

  /**
     * Sort the list based on Delivery delay
     * @param product
     * @returns {*}
     */
  buildOrderPrefFastFill(product) {
    const sellers = this.buildSellerList(product);

    // sort by best price
    sellers.sort((a, b) => {
      return a.deliveryWait - b.deliveryWait;
    });

    return sellers;
  }

  /**
     * Sort the list based on item quantity
     * @param product
     * @returns {*}
     */
  buildOrderPrefMostFill(product) {
    const sellers = this.buildSellerList(product);

    // sort by best price
    sellers.sort((a, b) => {
      return b.quantity - a.quantity;
    });

    return sellers;
  }

  /**
     * This method should get the best price for a given product
     * across all sellers
     */
  getBestPrice(product) {
    let lowestPrice = null;
    this.market.sellers.forEach(seller => {
      if (seller.inventory.hasOwnProperty(product)) {
        const price = seller.quote(product);
        if (lowestPrice === null || lowestPrice > price) lowestPrice = price;
      }
    });

    return lowestPrice || 0;
  }

  /**
     * Do the actual purchases based on preference list
     * @param preference
     * @param product
     * @param quantity
     * @returns {number}
     */
  doPurchases(preference, product, quantity) {
    const sellerPreference = [...preference];
    let total = 0;
    let wantedQuantity = quantity;
    const receipt = [];

    while (sellerPreference.length > 0 && wantedQuantity > 0) {
      const seller = sellerPreference.shift();

      const r = this.market.sellers[seller.index].sell(product, wantedQuantity);
      wantedQuantity = (wantedQuantity - r.boughtQuantity) < 0 ? 0 : (wantedQuantity - r.boughtQuantity);

      receipt.push(r);
    }

    if (receipt.length > 1)
      total = receipt.reduce((a, cv) => {
        return (typeof a === 'number' ? a : a.cost) + cv.cost;
      });
    else if (receipt.length === 1) total = receipt[0].cost;

    return total;
  }
  
  /**
     * This method should optimise price when filling an order
     * if the quantity is greater than any single seller can accomodate
     * then the next cheapest seller should be used.
     */
  fillWithBestPrices(product, quantity) {
    const sellerPreference = this.buildOrderPrefBestPrice(product);

    return this.doPurchases(sellerPreference, product, quantity);
  }

  /**
     * This method should optimise for sellers with the largest inventory when filling an order
     * if the quantity is greater than any single seller can accomodate
     * then the next largest seller should be used.
     * if multiple sellers have the same amount of inventory
     * you should use the cheaper of the two.
     */
  fillWithLargestSellers(product, quantity) {
    const sellerPreference = this.buildOrderPrefMostFill(product);

    return this.doPurchases(sellerPreference, product, quantity);
  }

  /**
     * This fulfils orders based on time to deliver
     * @param product
     * @param quantity
     * @returns {number}
     */
  quicklyFill(product, quantity) {
    const sellerPreference = this.buildOrderPrefFastFill(product);

    return this.doPurchases(sellerPreference, product, quantity);
  }
}

module.exports = { Buyer };

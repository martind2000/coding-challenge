const expect = require('expect');
const { asda, costco, budgens } = require('../marketplace');
const { Market } = require('../Market');
const { Buyer } = require('../Buyer');

describe('Buyer', function () {
  var market;
  beforeEach(() => {
    market = new Market([asda, budgens, costco]);
  });

  // getBestPrice

  it('should return best price', () => {
    const buyer = new Buyer(market);

    expect(buyer.getBestPrice('Apples')).toEqual(4.25);
  });

  it('should return best price that only 2 have', () => {
    const buyer = new Buyer(market);

    expect(buyer.getBestPrice('Grapes')).toEqual(21);
  });

  it('should return best price that only 1 has', () => {
    const buyer = new Buyer(market);

    expect(buyer.getBestPrice('Mangosteen')).toEqual(100.0);
  });

  it('should return 0 when fruit doesnt exist', () => {
    const buyer = new Buyer(market);

    expect(buyer.getBestPrice('Kumquat')).toEqual(0);
  });

  // Filling
  it('fill 10 apples', () => {
    const buyer = new Buyer(market);

    expect(buyer.fillWithBestPrices('Apples', 10)).toEqual(42.5);
  });

  it('fill 50 apples', () => {
    const buyer = new Buyer(market);

    expect(buyer.fillWithBestPrices('Apples', 50)).toEqual(233.60268569487857);
  });

  it('unable to fill 10 Kumquat', () => {
    const buyer = new Buyer(market);

    expect(buyer.fillWithBestPrices('Kumquat', 10)).toEqual(0);
  });

  // Large fill
  it('Large fill 50 apples', () => {
    const buyer = new Buyer(market);

    expect(buyer.fillWithLargestSellers('Apples', 50)).toEqual(312.5);
  });
});

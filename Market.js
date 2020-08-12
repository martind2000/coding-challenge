const { Subject, interval } = require('rxjs');

class Market {
    constructor(sellers) {
        this.sellers = sellers;
        this.observable = new Subject();
        this.observable.subscribe({
            next: (v) => this.tick()
        });
        interval(5000).subscribe(v => this.observable.next(v));
    }

    tick(){

        this.sellers.forEach(seller => {
            seller.tick()
        });
    }
}
exports.Market = Market;

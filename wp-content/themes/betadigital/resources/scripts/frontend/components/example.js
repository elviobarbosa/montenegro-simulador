export default class ScrollingAnimation {

    constructor() {
        this.selector = '.js-scroll';
        this.init();
    }

    init() {
        const selectors = document.querySelectorAll(this.selector);
        //console.log(selectors);

        if (selectors.length > 0) {
            this.start(selectors);
        }
    }

    start(elements) {
    }
}

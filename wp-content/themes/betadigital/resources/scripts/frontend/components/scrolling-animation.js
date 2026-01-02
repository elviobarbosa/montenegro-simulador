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

    start(scrollElements) {
        const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
    
        return (
            // eslint-disable-next-line no-undef
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
        };
    
        const elementOutofView = (el) => {
        const elementTop = el.getBoundingClientRect().top;
    
        return (
            // eslint-disable-next-line no-undef
            elementTop > (window.innerHeight || document.documentElement.clientHeight)
        );
        };
    
        const elementInViewDelay = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top - 400;
    
        return (
            // eslint-disable-next-line no-undef
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
            );
        };
    
        const elementOutofViewDelay = (el) => {
        const elementTop = el.getBoundingClientRect().top - 400;
    
        return (
            // eslint-disable-next-line no-undef
            elementTop > (window.innerHeight || document.documentElement.clientHeight)
        );
        };
    
        const displayScrollElement = (element) => {
            element.classList.add('scrolled');
        };
    
        const hideScrollElement = (element) => {
            element.classList.remove('scrolled');
        };
    
        const handleScrollAnimation = () => {
    
            scrollElements.forEach((el) => {
                if (el.hasAttribute('data-scroll-delay')) {
                    if (elementInViewDelay(el, 1.25)) {
                        displayScrollElement(el);
                    } else if (elementOutofViewDelay(el)) {
                        hideScrollElement(el);
                    }
                } else if (elementInView(el, 1.5)) {
                    displayScrollElement(el);
                } else if (elementOutofView(el)) {
                    hideScrollElement(el);
                }
            });
        };
    
        // eslint-disable-next-line no-undef
        window.addEventListener('scroll', () => {
            handleScrollAnimation();
        });
    }
}
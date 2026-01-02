export default class Modal {

    constructor() {
        this.selector = '[data-js="modal-close"]';
        if (this.selector) this.init();
    }

    init() {
        
        const close = document.querySelectorAll(this.selector);

        close.forEach(button => {
            button.addEventListener('click', e => {
                const modal = document.querySelector('[data-js="modal"]');
                modal.classList.remove('open');
            })
        })
    }

    
}

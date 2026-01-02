export default class ModalOpen {

    constructor() {
        this.selector = '[data-js="share"]';
        if (this.selector) this.init();
    }

    init() {
        const openModal = document.querySelectorAll(this.selector);

        openModal.forEach(button => {
            button.addEventListener('click', e => {
                const modal = document.querySelector('[data-js="modal"]');
                modal.classList.add('open');
            })
        })
    }

    
}

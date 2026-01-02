<div class="modal" data-js="modal">
    <div class="modal__overlay"></div>
    <div class="modal__container" style="width:<?php echo $args['width']; ?>; height:<?php echo $args['height']; ?>">
        <div class="modal__close" data-js="modal-close">
            <svg>
                <use href="<?php echo SVGPATH ?>close"></use>
            </svg>
        </div>
        
    </div>
</div>

<script>
    const modal = document.querySelector('[data-js="modal"]');
    const modalClose = document.querySelector('[data-js="modal-close"]');
    const modalOpen = document.querySelector('[data-js="modal-open"]');
    const modalContainer = document.querySelector('[data-js="modal-container"]');

    modalOpen.addEventListener('click', () => {
        modal.classList.add('modal--open');
    });
    modalClose.addEventListener('click', () => {
        modal.classList.remove('modal--open');
    });
</script>
/**
 * FAQ Toggle Functionality
 */
(function() {
  'use strict';

  function initFaqToggle() {
    const container = document.querySelector('[data-js="faq"]');
    if (!container) return;

    const items = container.querySelectorAll('[data-js="faq-item"]');

    items.forEach((item) => {
      const question = item.querySelector('[data-js="faq-question"]');
      const answer = item.querySelector('[data-js="faq-answer"]');
      const plusIcon = item.querySelector('[data-js="faq-expand"]');
      const minusIcon = item.querySelector('[data-js="faq-collapse"]');

      if (!question || !answer || !plusIcon || !minusIcon) return;

      answer.style.display = "none";
      minusIcon.style.display = "none";

      question.addEventListener("click", () => {
        const isOpen = answer.style.display === "block";

        // Fecha todos os itens
        items.forEach((otherItem) => {
          const otherAnswer = otherItem.querySelector('[data-js="faq-answer"]');
          const otherPlus = otherItem.querySelector('[data-js="faq-expand"]');
          const otherMinus = otherItem.querySelector('[data-js="faq-collapse"]');

          if (otherAnswer) otherAnswer.style.display = "none";
          if (otherPlus) otherPlus.style.display = "inline";
          if (otherMinus) otherMinus.style.display = "none";
        });

        // Abre o item clicado se estava fechado
        if (!isOpen) {
          answer.style.display = "block";
          plusIcon.style.display = "none";
          minusIcon.style.display = "inline";
        }
      });
    });
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqToggle);
  } else {
    initFaqToggle();
  }
})();

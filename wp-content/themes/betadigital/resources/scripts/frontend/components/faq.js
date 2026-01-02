export default class FaqToggle {
  constructor() {
    this.selector = '[data-js="faq"]';
    this.init();
  }

  init() {
    const container = document.querySelector(this.selector);
    if (!container) return;

    const items = container.querySelectorAll('[data-js="faq-item"]');

    items.forEach((item) => {
      const question = item.querySelector('[data-js="faq-question"]');
      const answer = item.querySelector('[data-js="faq-answer"]');
      const plusIcon = item.querySelector('[data-js="faq-expand"]');
      const minusIcon = item.querySelector('[data-js="faq-collapse"]');

      answer.style.display = "none";
      minusIcon.style.display = "none";

      question.addEventListener("click", () => {
        const isOpen = answer.style.display === "block";

        items.forEach((otherItem) => {
          const otherAnswer = otherItem.querySelector('[data-js="faq-answer"]');
          const otherPlus = otherItem.querySelector('[data-js="faq-expand"]');
          const otherMinus = otherItem.querySelector(
            '[data-js="faq-collapse"]'
          );

          otherAnswer.style.display = "none";
          otherPlus.style.display = "inline";
          otherMinus.style.display = "none";
        });

        if (!isOpen) {
          answer.style.display = "block";
          plusIcon.style.display = "none";
          minusIcon.style.display = "inline";
        }
      });
    });
  }
}

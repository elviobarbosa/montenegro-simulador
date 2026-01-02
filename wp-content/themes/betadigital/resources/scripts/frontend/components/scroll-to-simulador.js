export default class ScrollingToSimulador {
  constructor() {
    this.selector = '[data-js="scroll-to-simulador"]';
    this.init();
  }

  init() {
    const selectors = document.querySelectorAll(this.selector);

    if (selectors.length > 0) {
      this.start(selectors);
    }
  }

  start(elements) {
    elements.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault();

        const target = document.getElementById("map");

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }
}

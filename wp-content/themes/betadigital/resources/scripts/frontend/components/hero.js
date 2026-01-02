export default class Hero {
  constructor() {
    const selectors = document.querySelector(
      ".wp-block-beta-digital-blocks-hero-slider"
    );

    if (selectors) {
      this.init(selectors);
    }
  }

  init(selectors) {
    console.log(selectors);
    const links = selectors.querySelectorAll("a > mark");

    links.forEach((mark) => {
      const color = mark.style.color;
      const anchor = mark.closest("a");

      if (anchor && color) {
        anchor.style.textDecorationColor = color;
      }
    });
  }
}

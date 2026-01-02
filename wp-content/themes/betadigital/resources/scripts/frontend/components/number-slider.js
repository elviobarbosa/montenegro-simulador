export default class NumberSlider {
  constructor() {
    this.selector = document.querySelectorAll("[data-js=number-slider]");
    if (this.selector.length > 0) {
      this.init();
    }
  }

  init() {
    this.selector.forEach((simulador) => {
      const slider = simulador.querySelector('[data-js="prestacao-slider"]');
      const valorDisplay = simulador.querySelector('[data-js="valor-display"]');

      if (!slider || !valorDisplay) return;

      const updateValeu = (valor, min, max) => {
        valorDisplay.innerHTML = `<span>R$</span> ${Number(
          valor
        ).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

        let _value = ((valor - min) / (max - min)) * 100;
        console.log(slider);
        slider.style.background =
          "linear-gradient(to right, #316D78 0%, #316D78 " +
          _value +
          "%, #ddd " +
          _value +
          "%, #ddd 100%)";
      };

      updateValeu(slider.value, slider.min, slider.max);

      slider.addEventListener("input", (e) => {
        const _slider = e.target;
        updateValeu(_slider.value, _slider.min, _slider.max);
      });
    });
  }
}

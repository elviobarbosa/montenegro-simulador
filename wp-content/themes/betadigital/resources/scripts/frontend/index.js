import $ from "jquery";
import Menu from "./components/menu";
import Hero from "./components/hero";
import Carrosel from "./components/carrosel";
import FaqToggle from "./components/faq";
import JumpNavMenu from "./components/jump-nav-menu";
import NumberSlider from "./components/number-slider";
import InputMasks from "./components/input-masks";
import ScrollingToSimulador from "./components/scroll-to-simulador";

function domReady(fn) {
  document.addEventListener("DOMContentLoaded", fn);
  if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
  ) {
    new Menu();
    new Hero();
    new Carrosel();
    new FaqToggle();
    new JumpNavMenu();
    new NumberSlider();
    new InputMasks();
    new ScrollingToSimulador();
  } else {
    setTimeout(() => {
      domReady(fn);
    }, 100);
  }
}

domReady(() => {});

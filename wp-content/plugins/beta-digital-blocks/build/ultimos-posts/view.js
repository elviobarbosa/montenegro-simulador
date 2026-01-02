/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************************!*\
  !*** ./src/ultimos-posts/view.js ***!
  \***********************************/
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#ultimos-posts-container");
  const botao = document.querySelector("[data-js=carregar-mais-posts]");
  const loading = document.querySelector("#loading");
  if (container && botao) {
    botao.addEventListener("click", e => {
      e.preventDefault();
      let paged = parseInt(container.dataset.paged, 10) + 1;
      let maxPages = parseInt(container.dataset.maxPages, 10);
      if (loading) {
        loading.style.display = "block";
      }
      botao.disabled = true;
      botao.textContent = "Carregando...";
      fetch(`${window.location.origin}/wp-admin/admin-ajax.php?action=carregar_mais_posts&page=${paged}`).then(res => {
        if (!res.ok) {
          throw new Error("Erro na requisição");
        }
        return res.text();
      }).then(html => {
        if (html.trim()) {
          const wrapper = container.querySelector(".item-post:last-child");
          wrapper.insertAdjacentHTML("afterend", html);
          container.dataset.paged = paged;
          if (paged >= maxPages) {
            botao.style.display = "none";
          }
        } else {
          botao.style.display = "none";
        }
      }).catch(error => {
        console.error("Erro ao carregar posts:", error);
        alert("Erro ao carregar mais posts. Tente novamente.");
      }).finally(() => {
        if (loading) {
          loading.style.display = "none";
        }
        botao.disabled = false;
        botao.textContent = "Carregar mais";
      });
    });
  }
});
/******/ })()
;
//# sourceMappingURL=view.js.map
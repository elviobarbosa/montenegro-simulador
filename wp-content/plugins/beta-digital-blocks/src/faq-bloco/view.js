document.addEventListener("DOMContentLoaded", () => {
	const container = document.querySelector("#faq-container");
	const botao = document.querySelector("#carregar-mais-faqs");

	if (container && botao) {
		botao.addEventListener("click", () => {
			let paged = parseInt(container.dataset.paged, 10) + 1;

			fetch(`${window.ajaxurl}?action=carregar_mais_faqs&page=${paged}`)
				.then((res) => res.text())
				.then((html) => {
					container.insertAdjacentHTML("beforeend", html);
					container.dataset.paged = paged;
				});
		});
	}
});

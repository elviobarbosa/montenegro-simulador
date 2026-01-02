import $ from "jquery";

export default class JumpNavMenu {
  constructor(options = {}) {
    this.$selector = $("nav");
    if (this.$selector.length === 0) return;

    this.options = {
      scrollSpeed: 800,
      offset: 50,
      easing: "swing",
      ...options,
    };

    this.init(this.$selector);
  }

  init(selector) {
    const self = this;

    selector.each(function (index) {
      $("a", this).each(function () {
        const $link = $(this);
        const href = $link.attr("href");

        if (href && href.includes("#") && href.startsWith("#")) {
          $link.on("click", function (e) {
            e.preventDefault();
            self.scrollToTarget(href);
          });
        }
      });
    });
  }

  scrollToTarget(targetId) {
    const $target = $(targetId);
    if ($target.length === 0) {
      console.warn(`Elemento com ID ${targetId} não encontrado`);
      return;
    }

    this.closeMobileMenu();

    const targetPosition = $target.offset().top - this.options.offset;

    $("html, body").animate(
      {
        scrollTop: targetPosition,
      },
      {
        duration: this.options.scrollSpeed,
        easing: this.options.easing,
        complete: () => {
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }
        },
      }
    );
  }

  closeMobileMenu() {
    const $toggle = $(".nav-container__toggle");
    if ($toggle.length > 0 && $toggle.is(":checked")) {
      $toggle.prop("checked", false);
    }
  }

  updateActiveMenuItem() {
    const scrollPos = $(window).scrollTop() + this.options.offset + 10;

    this.$selector.find('a[href^="#"]').each(function () {
      const $link = $(this);
      const targetId = $link.attr("href");
      const $target = $(targetId);

      if ($target.length > 0) {
        const targetTop = $target.offset().top;
        const targetBottom = targetTop + $target.outerHeight();

        if (scrollPos >= targetTop && scrollPos < targetBottom) {
          $link.addClass("active");
        } else {
          $link.removeClass("active");
        }
      }
    });
  }

  enableActiveHighlight() {
    const self = this;
    $(window).on("scroll", () => {
      self.updateActiveMenuItem();
    });
    this.updateActiveMenuItem();
  }

  enableOverlayClose() {
    $(".nav-overlay").on("click", () => {
      this.closeMobileMenu();
    });
  }

  enableEscapeClose() {
    $(document).on("keydown", (e) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        this.closeMobileMenu();
      }
    });
  }
}

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/hero-slider/edit.js":
/*!*********************************!*\
  !*** ./src/hero-slider/edit.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);





function Edit(_ref) {
  let {
    attributes,
    setAttributes
  } = _ref;
  const {
    slides
  } = attributes;
  const [activeSlide, setActiveSlide] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();
  const updateSlide = (index, field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = {
      ...updatedSlides[index],
      [field]: value
    };
    setAttributes({
      slides: updatedSlides
    });
  };
  const updateImage = (index, media) => {
    updateSlide(index, "image", {
      url: media.url,
      alt: media.alt,
      id: media.id
    });
  };
  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: "Digite um título",
      linkText: "",
      linkUrl: "",
      image: {
        url: "",
        alt: "",
        id: 0
      },
      backgroundColor: "var(--wp--preset--color--primary-color)"
    };
    setAttributes({
      slides: [...slides, newSlide]
    });
    setActiveSlide(slides.length);
  };
  const removeSlide = index => {
    if (slides.length > 1) {
      const updated = slides.filter((_, i) => i !== index);
      setAttributes({
        slides: updated
      });
      setActiveSlide(Math.max(0, index - 1));
    }
  };
  const moveSlide = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= slides.length) return;
    const newSlides = [...slides];
    const [moved] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, moved);
    setAttributes({
      slides: newSlides
    });
    setActiveSlide(toIndex);
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Gerenciar Slides", "beta-digital-blocks")
  }, slides.map((slide, index) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    key: slide.id,
    variant: index === activeSlide ? "primary" : "tertiary",
    onClick: () => setActiveSlide(index),
    style: {
      marginRight: "0.5rem",
      marginBottom: "0.5rem"
    }
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Slide", "beta-digital-blocks"), " ", index + 1)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Flex, {
    gap: "8px",
    justify: "flex-start"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    icon: "arrow-left-alt2",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Mover slide", "beta-digital-blocks"),
    disabled: activeSlide === 0,
    onClick: () => moveSlide(activeSlide, activeSlide - 1)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    icon: "arrow-right-alt2",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Mover slide", "beta-digital-blocks"),
    disabled: activeSlide === slides.length - 1,
    onClick: () => moveSlide(activeSlide, activeSlide + 1)
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    variant: "secondary",
    onClick: addSlide
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Adicionar Slide", "beta-digital-blocks")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    variant: "tertiary",
    isDestructive: true,
    onClick: () => removeSlide(activeSlide),
    style: {
      marginTop: "1rem"
    }
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Remover Slide", "beta-digital-blocks"))), slides[activeSlide] && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.PanelColorSettings, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Cor de Fundo do Slide", "beta-digital-blocks"),
    initialOpen: false,
    colorSettings: [{
      value: slides[activeSlide].backgroundColor,
      onChange: color => updateSlide(activeSlide, "backgroundColor", color),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Cor de Fundo", "beta-digital-blocks")
    }]
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Imagem do Slide", "beta-digital-blocks"),
    initialOpen: false
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUploadCheck, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUpload, {
    onSelect: media => updateImage(activeSlide, media),
    allowedTypes: ["image"],
    value: slides[activeSlide].image.id,
    render: _ref2 => {
      let {
        open
      } = _ref2;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
        onClick: open,
        variant: "secondary"
      }, slides[activeSlide].image.url ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Alterar Imagem", "beta-digital-blocks") : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Selecionar Imagem", "beta-digital-blocks"));
    }
  })), slides[activeSlide].image.url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    variant: "tertiary",
    isDestructive: true,
    onClick: () => updateSlide(activeSlide, "image", {
      url: "",
      alt: "",
      id: 0
    })
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Remover Imagem", "beta-digital-blocks"))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Título e Link", "beta-digital-blocks"),
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h2",
    value: slides[activeSlide].title,
    onChange: value => updateSlide(activeSlide, "title", value),
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Digite o título...", "beta-digital-blocks")
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.BlockControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.AlignmentToolbar, {
    value: slides[activeSlide].imageAlignment,
    onChange: value => updateSlide(activeSlide, "imageAlignment", value || "center")
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, slides[activeSlide] && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "hero-slide-inner",
    style: {
      backgroundColor: slides[activeSlide].backgroundColor
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `hero-slide-image align-${slides[activeSlide].imageAlignment}`
  }, slides[activeSlide].image.url ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: slides[activeSlide].image.url,
    alt: slides[activeSlide].image.alt || ""
  }) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUploadCheck, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUpload, {
    onSelect: media => updateSlideImage(activeSlide, media),
    allowedTypes: ["image"],
    value: slides[activeSlide].image?.id,
    render: _ref3 => {
      let {
        open
      } = _ref3;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "hero-image-placeholder",
        onClick: open
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
        variant: "primary",
        icon: "format-image"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Adicionar Imagem", "beta-digital-blocks")));
    }
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "hero-slide-content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h2",
    value: slides[activeSlide].title,
    onChange: value => updateSlide(activeSlide, "title", value),
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Digite o título...", "beta-digital-blocks")
  })))));
}

/***/ }),

/***/ "./src/hero-slider/save.js":
/*!*********************************!*\
  !*** ./src/hero-slider/save.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);

// save.js

const swiperParams = {
  slidesPerView: "auto",
  spaceBetween: 30,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  }
};
function save(_ref) {
  let {
    attributes
  } = _ref;
  const {
    slides
  } = attributes;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
    className: "hero-slider-block swiper",
    "data-params": JSON.stringify(swiperParams)
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "swiper-wrapper"
  }, slides.map((slide, index) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: index,
    className: "swiper-slide hero-slide has-background",
    style: {
      backgroundColor: slide.backgroundColor
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "hero-slide-inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `hero-slide-image align-${slide.imageAlignment}`
  }, slide.image?.url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: slide.image.url,
    alt: slide.image.alt || ""
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "hero-slide-content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
    tagName: "h2",
    value: slide.title
  })))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "swiper-button-prev"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "swiper-button-next"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "swiper-pagination"
  }));
}

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./src/hero-slider/block.json":
/*!************************************!*\
  !*** ./src/hero-slider/block.json ***!
  \************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"beta-digital-blocks/hero-slider","title":"Hero Slider","category":"beta-digital-category","icon":"slides","description":"Slider com imagem à esquerda e texto à direita com link em palavra específica","keywords":["hero","slider","imagem","texto","link"],"version":"1.0.0","textdomain":"beta-digital-blocks","supports":{"html":false,"align":["wide","full"]},"attributes":{"imageAlignment":{"type":"string","default":"center"},"imageUrl":{"type":"string"},"imageId":{"type":"number"},"imageAlt":{"type":"string","source":"attribute","selector":"img","attribute":"alt","default":""},"slides":{"type":"array","default":[{"id":1,"title":"Título do Slide","content":"Texto do slide com palavra com link","linkText":"palavra","linkUrl":"https://example.com","image":{"url":"","alt":"","id":0},"backgroundColor":"#ffffff"}]}},"editorScript":"file:./index.js","editorStyle":"file:./editor.css","style":"file:./style.css"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************************!*\
  !*** ./src/hero-slider/index.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/hero-slider/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/hero-slider/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/hero-slider/block.json");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_4__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Hero Slider", "beta-digital-blocks"),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Slider de múltiplos slides hero com imagem e texto", "beta-digital-blocks"),
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map
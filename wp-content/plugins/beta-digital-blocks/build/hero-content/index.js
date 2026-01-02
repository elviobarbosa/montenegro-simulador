/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/button.js":
/*!**********************************!*\
  !*** ./src/components/button.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ButtonSettings)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);




function ButtonSettings(_ref) {
  let {
    button,
    setButton
  } = _ref;
  const safeButton = {
    text: "Comece já",
    url: "",
    style: "primary",
    target: "_self",
    icon: "",
    ...button
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
    title: "Configura\xE7\xF5es do bot\xE3o",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    label: "Texto",
    value: safeButton.text,
    onChange: value => setButton({
      ...safeButton,
      text: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.URLInput, {
    label: "URL",
    value: safeButton.url,
    onChange: value => setButton({
      ...safeButton,
      url: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
    label: "Estilo",
    value: safeButton.style,
    options: [{
      label: "Primário",
      value: "primary"
    }, {
      label: "Secundário",
      value: "secondary"
    }, {
      label: "Terciário",
      value: "tertiary"
    }],
    onChange: value => setButton({
      ...safeButton,
      style: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
    label: "Target",
    value: safeButton.target,
    options: [{
      label: "Mesma janela",
      value: "_self"
    }, {
      label: "Nova janela",
      value: "_blank"
    }],
    onChange: value => setButton({
      ...safeButton,
      target: value
    })
  }));
}

/***/ }),

/***/ "./src/hero-content/edit.js":
/*!**********************************!*\
  !*** ./src/hero-content/edit.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/button */ "./src/components/button.js");





const ALLOWED_BLOCKS = ["core/image"];
function Edit(_ref) {
  let {
    attributes,
    setAttributes
  } = _ref;
  const {
    imageDesktop,
    imageMobile,
    tagline,
    title,
    items,
    button,
    invertLayout
  } = attributes;
  const onChangeItem = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setAttributes({
      items: newItems
    });
  };
  const setButtonAttribute = newButton => {
    setAttributes({
      button: newButton
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "hero-content__content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
    tagName: "p",
    className: "tagline",
    value: attributes.tagline,
    onChange: value => setAttributes({
      tagline: value
    }),
    placeholder: "Digite a tagline..."
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
    tagName: "h2",
    value: attributes.title,
    onChange: value => setAttributes({
      title: value
    }),
    placeholder: "T\xEDtulo"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "list-items"
  }, items.map((item, index) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: index
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "hero-content__edit-item-container"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "hero-content__edit-icon"
  }, item.icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: item.icon,
    alt: item.iconAlt || "",
    title: item.iconTitle || ""
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
    onSelect: media => {
      const newItems = [...attributes.items];
      newItems[index] = {
        ...newItems[index],
        icon: media.url,
        iconAlt: media.alt,
        iconTitle: media.title
      };
      setAttributes({
        items: newItems
      });
    },
    allowedTypes: ["image"],
    render: _ref2 => {
      let {
        open
      } = _ref2;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        onClick: open,
        className: "button"
      }, item.icon ? "Trocar ícone" : "Selecionar ícone");
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
    tagName: "p",
    value: item.text,
    onChange: value => onChangeItem(index, "text", value),
    placeholder: "Texto do item"
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    className: "button",
    onClick: () => setAttributes({
      items: [...items, {
        icon: "",
        text: ""
      }]
    })
  }, "Adicionar item"))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: button.url || "#",
    className: "cta-button editor-cta-preview"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
    tagName: "span",
    value: button.text,
    onChange: value => setAttributes({
      ...button,
      text: value
    }),
    placeholder: "Texto do bot\xE3o",
    allowedFormats: []
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
    template: [["custom/hero-image-desktop"], ["custom/hero-image-mobile"]],
    templateLock: "all"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
    title: "Layout",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
    label: "Inverter Layout no Desktop",
    checked: invertLayout,
    onChange: value => setAttributes({
      invertLayout: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_button__WEBPACK_IMPORTED_MODULE_3__["default"], {
    button: button,
    setButton: setButtonAttribute
  })));
}

/***/ }),

/***/ "./src/hero-content/save.js":
/*!**********************************!*\
  !*** ./src/hero-content/save.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/html-entities */ "@wordpress/html-entities");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3__);




function save(_ref) {
  let {
    attributes
  } = _ref;
  const {
    imageDesktop,
    imageMobile,
    tagline,
    title,
    items,
    button,
    invertLayout
  } = attributes;
  const layoutClass = invertLayout ? "invert-layout" : "";
  const buttonText = button?.text || "";
  const buttonUrl = button?.url || "";
  const buttonStyle = button?.style || "primary";
  const buttonTarget = button?.target || "_self";
  const cleanTitle = attributes.title?.replace(/<[^>]+>/g, "") || "";
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save(), {
    className: `hero-content hero-content__block ${layoutClass}`
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "hero-content__content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
    tagName: "p",
    className: "hero-content__tagline",
    value: attributes.tagline
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
    tagName: "h2",
    className: "hero-content__title",
    value: attributes.title
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("ul", {
    className: "hero-content__items"
  }, items.map((item, index) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", {
    key: index,
    className: "hero-content__item"
  }, item.icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("img", {
    src: item.icon,
    alt: item.iconAlt || "",
    title: item.iconTitle || "",
    className: "hero-icon"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
    tagName: "span",
    value: item.text
  })))), buttonText && buttonUrl && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("a", {
    className: `button button--${buttonStyle}`,
    href: buttonUrl,
    alt: `Veja mais sobre ${cleanTitle}`,
    target: buttonTarget,
    rel: buttonTarget === "_blank" ? "noopener noreferrer" : undefined
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
    tagName: "span",
    value: buttonText
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "image"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null)));
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

/***/ "@wordpress/html-entities":
/*!**************************************!*\
  !*** external ["wp","htmlEntities"] ***!
  \**************************************/
/***/ ((module) => {

module.exports = window["wp"]["htmlEntities"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./src/hero-content/block.json":
/*!*************************************!*\
  !*** ./src/hero-content/block.json ***!
  \*************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"apiVersion":2,"name":"custom/hero-content","title":"Hero com Imagem e Lista","category":"layout","icon":"format-image","description":"Bloco com imagem (desktop/mobile), texto e lista com ícones.","attributes":{"imageDesktop":{"type":"string"},"imageMobile":{"type":"string"},"button":{"type":"object","default":{"text":"Comece já","url":"","style":"primary","target":"_self","icon":""}},"tagline":{"type":"string"},"title":{"type":"string"},"ctaText":{"type":"string"},"ctaUrl":{"type":"string"},"items":{"type":"array","default":[],"items":{"type":"object","properties":{"icon":{"type":"string"},"iconAlt":{"type":"string"},"iconTitle":{"type":"string"},"text":{"type":"string"}}}},"invertLayout":{"type":"boolean","default":false}},"usesContext":[],"providesContext":{},"innerBlocks":true,"template":[["custom/hero-image-desktop"],["custom/hero-image-mobile"]],"supports":{"html":false},"editorScript":"file:./index.js"}');

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
/*!***********************************!*\
  !*** ./src/hero-content/index.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/hero-content/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/hero-content/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/hero-content/block.json");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_4__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Hero Content", "beta-digital-blocks"),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Bloco com imagem (desktop/mobile), texto e lista com ícones.", "beta-digital-blocks"),
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/block-gallery/edit.js":
/*!***********************************!*\
  !*** ./src/block-gallery/edit.js ***!
  \***********************************/
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



//import './editor.scss';

function Edit(_ref) {
  let {
    attributes,
    setAttributes
  } = _ref;
  const ALLOWED_BLOCKS = ['core/gallery'];
  const TEMPLATE = [['core/gallery', {
    className: 'bd-block__gallery',
    align: 'full'
  }]];
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks, {
    allowedBlocks: ALLOWED_BLOCKS,
    template: TEMPLATE
  }));
}

/***/ }),

/***/ "./src/block-gallery/save.js":
/*!***********************************!*\
  !*** ./src/block-gallery/save.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);


function save(_ref) {
  let {
    attributes
  } = _ref;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save();
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: attributes.imageUrl,
    alt: attributes.imageAlt
  })));
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

/***/ "./src/block-gallery/block.json":
/*!**************************************!*\
  !*** ./src/block-gallery/block.json ***!
  \**************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"create-block/block-gallery","version":"0.1.0","title":"Block Galeria","category":"beta-digital-category","icon":"smiley","description":"Galeria de imagens","supports":{"html":false},"textdomain":"block-call-to-action","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","attributes":{"imageUrl":{"type":"string"},"imageId":{"type":"number"},"imageAlt":{"type":"string","source":"attribute","selector":"img","attribute":"alt","default":""}}}');

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
/*!************************************!*\
  !*** ./src/block-gallery/index.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/block-gallery/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./save */ "./src/block-gallery/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block.json */ "./src/block-gallery/block.json");






// /**
//  * Block Name.
//  * Create an example Call to Action Block
//  * Uses InnerBlocks for editable content within.
//  */
// import metadata from './block.json';
// import { BLOCK_CONFIG } from './variations';
// export const blockName = 'block-call-to-action';

// wp.blocks.registerBlockVariation('core/cover', {
//     name: 'cover-variation',
//     title: 'Cover Variation',
// 	category: 'beta-digital-category',
//     icon: 'star-filled',
//     attributes: {
//         className: 'is-awesome',
//         align: 'full'
//     }
// });
// // Register the block via WP func. Change 'myplugin' to your plugin or theme.
// registerBlockType(`beta-digital/${blockName}`, {
// 	title: __('Call to Action', 'locale'), // Change 'locale' to your locale for internationalization.
// 	description: __(
// 		'Call to action block with headline and buttons',
// 		'locale'
// 	),

// 	category: 'beta-digital-category',
// 	supports: {
// 		anchor: true,
// 		defaultStylePicker: false,
// 		html: false,
// 		align: false,
// 	},
// 	attributes: {
// 		anchor: {
// 			type: 'string',
// 			default: '',
// 		},
// 	},
// 	transforms: {},
// 	variations: [],
// 	edit: (props) => {
// 		const blockProps = useBlockProps({
// 			className: `wp-block-myplugin-${blockName}`,
// 		});

// 		return (
// 			<div {...blockProps}>
// 				<div className="cta__inner">
// 					<div className="cta__inner-blocks-wrapper">
// 						<InnerBlocks
// 							template={BLOCK_CONFIG.CTA_TEMPLATE}
// 							allowedBlocks={BLOCK_CONFIG.ALLOWED_BLOCKS}
// 							renderAppender={false}
// 						/>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	},
// 	save: () => {
// 		return (
// 			<div>
// 				<div className="cta__inner">
// 					<InnerBlocks.Content />
// 				</div>
// 			</div>
// 		);
// 	},
// });

// import { registerBlockType } from '@wordpress/blocks';
// import './style.scss';

/**
 * Internal dependencies
 */




// wp.blocks.registerBlockVariation(
// 	'core/gallery',
// 	{
// 		name: 'beta-digital-gallery-variation',
// 		title: 'Frame Style Gallery',
// 		icon: 'star-filled',
// 		isDefault: true,
// 		category: 'beta-digital-category'
// 	}
// );

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_6__.name, {
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  /**
   * @see ./save.js
   */
  save: () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null)
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map
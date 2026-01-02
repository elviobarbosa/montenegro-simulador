/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/container/edit.js":
/*!*******************************!*\
  !*** ./src/container/edit.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);


// edit.js


function Edit(_ref) {
  let {
    attributes,
    setAttributes
  } = _ref;
  const {
    maxWidth,
    height,
    paddingDesktop,
    paddingMobile,
    displayDesktop,
    displayMobile,
    flexDirectionDesktop,
    flexDirectionMobile,
    justifyContentDesktop,
    justifyContentMobile,
    alignItemsDesktop,
    alignItemsMobile
  } = attributes;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: "custom-container-block"
  });
  const style = {
    "--max-width": maxWidth || "1420px",
    "--height": height || "inherit",
    "--padding-desktop": paddingDesktop || "0 120x",
    "--padding-mobile": paddingMobile || "0 20px",
    "--display-desktop": displayDesktop || "block",
    "--display-mobile": displayMobile || "block",
    "--flex-direction-desktop": flexDirectionDesktop || "row",
    "--flex-direction-mobile": flexDirectionMobile || "column",
    "--justify-content-desktop": justifyContentDesktop || "flex-start",
    "--justify-content-mobile": justifyContentMobile || "flex-start",
    "--align-items-desktop": alignItemsDesktop || "stretch",
    "--align-items-mobile": alignItemsMobile || "stretch"
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "Layout do Container",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: "Largura m\xE1xima",
    value: maxWidth,
    onChange: value => setAttributes({
      maxWidth: value
    }),
    help: "Ex: 1200px, 100%, 80rem"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: "Altura",
    value: height,
    onChange: value => setAttributes({
      height: value
    }),
    help: "Ex: 1200px, 100%, 80rem"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: "Padding (Desktop)",
    value: paddingDesktop,
    onChange: value => setAttributes({
      paddingDesktop: value
    }),
    help: "Ex: 40px 20px"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: "Padding (Mobile)",
    value: paddingMobile,
    onChange: value => setAttributes({
      paddingMobile: value
    }),
    help: "Ex: 20px 10px"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "Flexbox (Desktop)",
    initialOpen: false
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Display",
    value: displayDesktop,
    onChange: value => setAttributes({
      displayDesktop: value
    }),
    options: [{
      label: "Block",
      value: "block"
    }, {
      label: "Flex",
      value: "flex"
    }]
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Flex Direction",
    value: flexDirectionDesktop,
    onChange: value => setAttributes({
      flexDirectionDesktop: value
    }),
    options: [{
      label: "Row",
      value: "row"
    }, {
      label: "Column",
      value: "column"
    }]
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Justify Content",
    value: justifyContentDesktop,
    onChange: value => setAttributes({
      justifyContentDesktop: value
    }),
    options: [{
      label: "Flex Start",
      value: "flex-start"
    }, {
      label: "Center",
      value: "center"
    }, {
      label: "Flex End",
      value: "flex-end"
    }, {
      label: "Space Between",
      value: "space-between"
    }, {
      label: "Space Around",
      value: "space-around"
    }]
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Align Items",
    value: alignItemsDesktop,
    onChange: value => setAttributes({
      alignItemsDesktop: value
    }),
    options: [{
      label: "Stretch",
      value: "stretch"
    }, {
      label: "Center",
      value: "center"
    }, {
      label: "Flex Start",
      value: "flex-start"
    }, {
      label: "Flex End",
      value: "flex-end"
    }, {
      label: "Baseline",
      value: "baseline"
    }]
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "Flexbox (Mobile)",
    initialOpen: false
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Display",
    value: displayMobile,
    onChange: value => setAttributes({
      displayMobile: value
    }),
    options: [{
      label: "Block",
      value: "block"
    }, {
      label: "Flex",
      value: "flex"
    }]
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Flex Direction",
    value: flexDirectionMobile,
    onChange: value => setAttributes({
      flexDirectionMobile: value
    }),
    options: [{
      label: "Row",
      value: "row"
    }, {
      label: "Column",
      value: "column"
    }]
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Justify Content",
    value: justifyContentMobile,
    onChange: value => setAttributes({
      justifyContentMobile: value
    }),
    options: [{
      label: "Flex Start",
      value: "flex-start"
    }, {
      label: "Center",
      value: "center"
    }, {
      label: "Flex End",
      value: "flex-end"
    }, {
      label: "Space Between",
      value: "space-between"
    }, {
      label: "Space Around",
      value: "space-around"
    }]
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Align Items",
    value: alignItemsMobile,
    onChange: value => setAttributes({
      alignItemsMobile: value
    }),
    options: [{
      label: "Stretch",
      value: "stretch"
    }, {
      label: "Center",
      value: "center"
    }, {
      label: "Flex Start",
      value: "flex-start"
    }, {
      label: "Flex End",
      value: "flex-end"
    }, {
      label: "Baseline",
      value: "baseline"
    }]
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, blockProps, {
    style: style
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks, null)));
}

/***/ }),

/***/ "./src/container/index.js":
/*!********************************!*\
  !*** ./src/container/index.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block.json */ "./src/container/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/container/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/container/save.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/container/style.scss");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_1__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./src/container/save.js":
/*!*******************************!*\
  !*** ./src/container/save.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Save)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);

// save.js

function Save(_ref) {
  let {
    attributes
  } = _ref;
  const {
    maxWidth,
    height,
    paddingDesktop,
    paddingMobile,
    displayDesktop,
    displayMobile,
    flexDirectionDesktop,
    flexDirectionMobile,
    justifyContentDesktop,
    justifyContentMobile,
    alignItemsDesktop,
    alignItemsMobile
  } = attributes;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
    className: "custom-container-block",
    style: {
      "--max-width": maxWidth || "100%",
      "--height": height || "",
      "--padding-desktop": paddingDesktop || "0",
      "--padding-mobile": paddingMobile || "0",
      "--display-desktop": displayDesktop || "block",
      "--display-mobile": displayMobile || "block",
      "--flex-direction-desktop": flexDirectionDesktop || "row",
      "--flex-direction-mobile": flexDirectionMobile || "column",
      "--justify-content-desktop": justifyContentDesktop || "flex-start",
      "--justify-content-mobile": justifyContentMobile || "flex-start",
      "--align-items-desktop": alignItemsDesktop || "stretch",
      "--align-items-mobile": alignItemsMobile || "stretch"
    }
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null));
}

/***/ }),

/***/ "./src/container/style.scss":
/*!**********************************!*\
  !*** ./src/container/style.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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

/***/ "./src/container/block.json":
/*!**********************************!*\
  !*** ./src/container/block.json ***!
  \**********************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"beta-digital-blocks/custom-container","title":"Container Responsivo","category":"beta-digital-category","description":"Container flexível com controles responsivos avançados para layout.","keywords":["container","flexbox","responsive","layout"],"version":"1.0.0","textdomain":"beta-digital-blocks","icon":"layout","supports":{"html":false,"align":["wide","full"],"spacing":{"margin":true,"padding":false,"blockGap":true},"color":{"background":true,"text":false,"gradients":true},"typography":{"fontSize":false,"lineHeight":false}},"attributes":{"maxWidth":{"type":"string","default":"1420px"},"height":{"type":"string","default":""},"paddingDesktop":{"type":"string","default":"0 122px"},"paddingMobile":{"type":"string","default":"0 20px"},"displayDesktop":{"type":"string","default":"block","enum":["block","flex"]},"displayMobile":{"type":"string","default":"block","enum":["block","flex"]},"flexDirectionDesktop":{"type":"string","default":"row","enum":["row","column"]},"flexDirectionMobile":{"type":"string","default":"column","enum":["row","column"]},"justifyContentDesktop":{"type":"string","default":"flex-start","enum":["flex-start","center","flex-end","space-between","space-around"]},"justifyContentMobile":{"type":"string","default":"flex-start","enum":["flex-start","center","flex-end","space-between","space-around"]},"alignItemsDesktop":{"type":"string","default":"stretch","enum":["stretch","center","flex-start","flex-end","baseline"]},"alignItemsMobile":{"type":"string","default":"stretch","enum":["stretch","center","flex-start","flex-end","baseline"]}},"providesContext":{"beta-digital-blocks/containerSettings":"attributes"},"usesContext":[],"example":{"attributes":{"maxWidth":"1200px","paddingDesktop":"40px 20px","paddingMobile":"20px 10px","displayDesktop":"flex","displayMobile":"flex","flexDirectionDesktop":"row","flexDirectionMobile":"column","justifyContentDesktop":"center","justifyContentMobile":"center"},"innerBlocks":[{"name":"core/heading","attributes":{"content":"Container Responsivo","level":2}},{"name":"core/paragraph","attributes":{"content":"Este é um exemplo de container com controles flexbox responsivos."}}]},"editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css"}');

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"container/index": 0,
/******/ 			"container/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkbeta_digital_blocks"] = globalThis["webpackChunkbeta_digital_blocks"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["container/style-index"], () => (__webpack_require__("./src/container/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map
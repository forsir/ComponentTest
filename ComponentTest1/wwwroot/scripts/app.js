/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Component = exports.EvtSource = void 0;
var EventsListener_1 = __webpack_require__(5);
var BroadcastData_1 = __webpack_require__(7);
var RenderQueue_1 = __webpack_require__(8);
var mustache_1 = __webpack_require__(2);
var RootComponent_1 = __webpack_require__(1);
var __uid = 0;
var EvtSource = (function () {
    function EvtSource() {
        this.listeners = {};
    }
    EvtSource.prototype.open = function (url) {
        if (this.evtSource) {
            this.remove();
        }
        this.evtSource = new EventSource(url);
    };
    EvtSource.prototype.addListener = function (type, callback, options) {
        this.evtSource.addEventListener(type, callback, options);
        this.listeners[type] = callback;
    };
    EvtSource.prototype.close = function () {
        if (!this.evtSource)
            return;
        this.evtSource.close();
    };
    EvtSource.prototype.remove = function () {
        var _this = this;
        if (!this.evtSource)
            return;
        Object.keys(this.listeners).forEach(function (key) {
            _this.evtSource.removeEventListener(key, _this.listeners[key]);
        });
        this.listeners = {};
        this.evtSource.close();
        this.evtSource = null;
    };
    EvtSource.prototype.onError = function (callback) {
        this.evtSource.onerror = callback;
    };
    return EvtSource;
}());
exports.EvtSource = EvtSource;
var Component = (function () {
    function Component(props) {
        if (props === void 0) { props = {}; }
        this.children = {};
        this.state = {};
        this._isDirty = true;
        this.eventSrc = new EvtSource();
        if (props.state) {
            this.setState(props.state);
        }
        this.cid = props.id || "mqC-" + ++__uid;
        this.onCreated();
    }
    Component.prototype.getId = function () {
        return this.cid;
    };
    Component.prototype.setId = function (id) {
        this.cid = id || this.cid;
    };
    Component.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    Component.prototype.getParent = function () {
        return this.parent;
    };
    Component.prototype.mount = function ($element) {
        this.onBeforeMount($element);
        var id = this.getId();
        if (!$element.id) {
            $element.id = id;
        }
        else {
            id = $element.id;
        }
        this.cid = id;
        this.$element = $element;
        this._eventResolver = new EventsListener_1.EventsListener(this);
        this.onMount();
    };
    Component.prototype.unmount = function () {
        this.eventSrc.remove();
        this._eventResolver.remove();
        for (var key in this.children) {
            var child = this.children[key];
            child.unmount();
        }
        this.onUnmount();
    };
    Component.prototype.markDirty = function (isDirty) {
        if (isDirty === void 0) { isDirty = true; }
        this._isDirty = isDirty;
    };
    Component.prototype.isDirty = function () {
        return this._isDirty;
    };
    Component.prototype.setElement = function (element) {
        this.$element = element;
    };
    Component.prototype.getElement = function () {
        if (!this.hasElement()) {
            this.$element = document.getElementById(this.getId());
        }
        return this.$element;
    };
    Component.prototype.hasElement = function () {
        return !!this.$element;
    };
    Component.prototype.addChild = function (id, child) {
        child.setParent(this);
        child.setId(id);
        this.children[child.getId()] = child;
    };
    Component.prototype.deleteChild = function (idx) {
        var child = this.children[idx];
        if (!child) {
            throw Error("Child " + idx + " not found");
        }
        var $el = child.getElement();
        if ($el) {
            this.$element.removeChild($el);
        }
        this.children[idx] = undefined;
    };
    Component.prototype.deleteAllChildren = function () {
        for (var key in this.children) {
            var child = this.children[key];
            var $el = child.getElement();
            if ($el) {
                try {
                    this.$element.removeChild($el);
                }
                catch (e) {
                }
            }
        }
        this.children = {};
    };
    Component.prototype.getChildren = function () {
        return this.children;
    };
    Component.prototype.findChild = function (id) {
        return this.children[id];
    };
    Component.prototype.on = function (event, listener) {
        return this._eventResolver.addEventListener(event, listener);
    };
    Component.prototype.off = function (event) {
        return this._eventResolver.removeEventListener(event);
    };
    Component.prototype.render = function () {
        var needRender = this.isDirty();
        if (this.parent) {
            needRender = needRender && !this.parent.isDirty();
        }
        if (needRender) {
            this.onBeforeRender();
            this._render();
            this.onAfterRender();
        }
        this.onAfterChildrenRendered();
    };
    Component.prototype.getTemplate = function () {
        return null;
    };
    Component.prototype.onBroadcast = function (ed) {
    };
    Component.prototype.broadcast = function () {
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        var ed = new BroadcastData_1.BroadcastData(this, actions);
        RootComponent_1.RootComponent.root.walk(function (component) {
            if (component['onBroadcast'] !== undefined) {
                component['onBroadcast'](ed);
            }
        });
        return this;
    };
    Component.prototype.walk = function (callback) {
        for (var key in this.children) {
            var child = this.children[key];
            child.walk(callback);
        }
        callback(this);
        return this;
    };
    Component.prototype.onCreated = function () {
    };
    Component.prototype.onBeforeMount = function ($element) {
    };
    Component.prototype.onMount = function () {
    };
    Component.prototype.onUnmount = function () {
    };
    Component.prototype.onBeforeRender = function () {
    };
    Component.prototype.onAfterRender = function () {
    };
    Component.prototype.onBeforeUpdate = function () {
    };
    Component.prototype.onAfterUpdate = function () {
    };
    Component.prototype.onAfterChildrenRendered = function () {
    };
    Component.prototype.update = function (state) {
        if (JSON.stringify(state) !== JSON.stringify(this.state)) {
            this.markDirty();
        }
        this.setState(state);
        RenderQueue_1.enqueueRender(this);
    };
    Component.prototype.updateStateProperties = function (properties) {
        var state = __assign(__assign({}, this.state), properties);
        this.update(state);
    };
    Component.prototype.getState = function () {
        return __assign({}, this.state);
    };
    Component.prototype.setState = function (state) {
        this.onBeforeUpdate();
        this.state = __assign({}, state);
        this.onAfterUpdate();
    };
    Component.prototype.show = function () {
        this.getElement().style.display = "block";
    };
    Component.prototype.hide = function () {
        this.getElement().style.display = "none";
    };
    Component.prototype.isShown = function () {
        return this.getElement().style.display == "block";
    };
    Component.prototype.addClassName = function (className) {
        if (this.hasClassName(className)) {
            return;
        }
        this.getElement().className += ' ' + className;
    };
    Component.prototype.removeClassName = function (className) {
        var $el = this.getElement();
        $el.className = $el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };
    Component.prototype.hasClassName = function (className) {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(this.getElement().className);
    };
    Component.prototype.getRoute = function () {
        return location.hash.replace('#/', '');
    };
    Component.prototype.getRenderedChildren = function () {
        return {};
    };
    Component.prototype.getRenderedContent = function () {
        var template = this.getTemplate();
        this.markDirty(false);
        if (template) {
            var partials = __assign({}, this.getRenderedChildren());
            for (var key in this.children) {
                var child = this.children[key];
                partials[key] = child.getRenderedContent();
            }
            return '<div id="' + this.getId() + '">' + mustache_1.render(template, this.state, partials) + '</div>';
        }
    };
    Component.prototype._render = function () {
        this.markDirty(false);
        var rendered = this.getRenderedContent();
        var element = this.getElement();
        if (element) {
            if (element.innerHTML !== rendered) {
                element.innerHTML = rendered;
            }
        }
    };
    return Component;
}());
exports.Component = Component;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.RootComponent = void 0;
var mustache_1 = __webpack_require__(2);
var Component_1 = __webpack_require__(0);
var PageComponent_1 = __webpack_require__(9);
var RootComponent = (function (_super) {
    __extends(RootComponent, _super);
    function RootComponent(props) {
        var _this = _super.call(this, props) || this;
        RootComponent.root = _this;
        _this.addChild('page', new PageComponent_1.PageComponent(props));
        return _this;
    }
    RootComponent.prototype.getTemplate = function () {
        return "{{>page}}";
    };
    RootComponent.prototype.getRenderedContent = function () {
        var template = this.getTemplate();
        this.markDirty(false);
        if (template) {
            var partials = __assign({}, this.getRenderedChildren());
            for (var key in this.children) {
                var child = this.children[key];
                partials[key] = child.getRenderedContent();
            }
            return mustache_1.render(template, this.state, partials);
        }
    };
    return RootComponent;
}(Component_1.Component));
exports.RootComponent = RootComponent;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
   true ? module.exports = factory() :
  undefined;
}(this, (function () { 'use strict';

  /*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   */

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  /**
   * Safe way of detecting whether or not the given thing is a primitive and
   * whether it has the given property
   */
  function primitiveHasOwnProperty (primitive, propName) {
    return (
      primitive != null
      && typeof primitive !== 'object'
      && primitive.hasOwnProperty
      && primitive.hasOwnProperty(propName)
    );
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   *
   * Tokens for partials also contain two more elements: 1) a string value of
   * indendation prior to that tag and 2) the index of that tag on that line -
   * eg a value of 2 indicates the partial is the third tag on this line.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];
    var lineHasNonSpace = false;
    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?
    var indentation = '';  // Tracks indentation for tags that use it
    var tagIndex = 0;      // Stores a count of number of tags encountered on a line

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
            indentation += chr;
          } else {
            nonSpace = true;
            lineHasNonSpace = true;
            indentation += ' ';
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n') {
            stripSpace();
            indentation = '';
            tagIndex = 0;
            lineHasNonSpace = false;
          }
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      if (type == '>') {
        token = [ type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace ];
      } else {
        token = [ type, value, start, scanner.pos ];
      }
      tagIndex++;
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    stripSpace();

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, intermediateValue, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          intermediateValue = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           *
           * In the case where dot notation is used, we consider the lookup
           * to be successful even if the last "object" in the path is
           * not actually an object but a primitive (e.g., a string, or an
           * integer), because it is sometimes useful to access a property
           * of an autoboxed primitive, such as the length of a string.
           **/
          while (intermediateValue != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = (
                hasProperty(intermediateValue, names[index])
                || primitiveHasOwnProperty(intermediateValue, names[index])
              );

            intermediateValue = intermediateValue[names[index++]];
          }
        } else {
          intermediateValue = context.view[name];

          /**
           * Only checking against `hasProperty`, which always returns `false` if
           * `context.view` is not an object. Deliberately omitting the check
           * against `primitiveHasOwnProperty` if dot notation is not used.
           *
           * Consider this example:
           * ```
           * Mustache.render("The length of a football field is {{#length}}{{length}}{{/length}}.", {length: "100 yards"})
           * ```
           *
           * If we were to check also against `primitiveHasOwnProperty`, as we do
           * in the dot notation case, then render call would return:
           *
           * "The length of a football field is 9."
           *
           * rather than the expected:
           *
           * "The length of a football field is 100 yards."
           **/
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit) {
          value = intermediateValue;
          break;
        }

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.templateCache = {
      _cache: {},
      set: function set (key, value) {
        this._cache[key] = value;
      },
      get: function get (key) {
        return this._cache[key];
      },
      clear: function clear () {
        this._cache = {};
      }
    };
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    if (typeof this.templateCache !== 'undefined') {
      this.templateCache.clear();
    }
  };

  /**
   * Parses and caches the given `template` according to the given `tags` or
   * `mustache.tags` if `tags` is omitted,  and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.templateCache;
    var cacheKey = template + ':' + (tags || mustache.tags).join(':');
    var isCacheEnabled = typeof cache !== 'undefined';
    var tokens = isCacheEnabled ? cache.get(cacheKey) : undefined;

    if (tokens == undefined) {
      tokens = parseTemplate(template, tags);
      isCacheEnabled && cache.set(cacheKey, tokens);
    }
    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   *
   * If the optional `config` argument is given here, then it should be an
   * object with a `tags` attribute or an `escape` attribute or both.
   * If an array is passed, then it will be interpreted the same way as
   * a `tags` attribute on a `config` object.
   *
   * The `tags` attribute of a `config` object must be an array with two
   * string values: the opening and closing tags used in the template (e.g.
   * [ "<%", "%>" ]). The default is to mustache.tags.
   *
   * The `escape` attribute of a `config` object must be a function which
   * accepts a string as input and outputs a safely escaped string.
   * If an `escape` function is not provided, then an HTML-safe string
   * escaping function is used as the default.
   */
  Writer.prototype.render = function render (template, view, partials, config) {
    var tags = this.getConfigTags(config);
    var tokens = this.parse(template, tags);
    var context = (view instanceof Context) ? view : new Context(view, undefined);
    return this.renderTokens(tokens, context, partials, template, config);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate, config) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate, config);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate, config);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, config);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context, config);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate, config) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials, config);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate, config);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate, config);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate, config);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate, config) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate, config);
  };

  Writer.prototype.indentPartial = function indentPartial (partial, indentation, lineHasNonSpace) {
    var filteredIndentation = indentation.replace(/[^ \t]/g, '');
    var partialByNl = partial.split('\n');
    for (var i = 0; i < partialByNl.length; i++) {
      if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
        partialByNl[i] = filteredIndentation + partialByNl[i];
      }
    }
    return partialByNl.join('\n');
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials, config) {
    if (!partials) return;
    var tags = this.getConfigTags(config);

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null) {
      var lineHasNonSpace = token[6];
      var tagIndex = token[5];
      var indentation = token[4];
      var indentedValue = value;
      if (tagIndex == 0 && indentation) {
        indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
      }
      var tokens = this.parse(indentedValue, tags);
      return this.renderTokens(tokens, context, partials, indentedValue, config);
    }
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context, config) {
    var escape = this.getConfigEscape(config) || mustache.escape;
    var value = context.lookup(token[1]);
    if (value != null)
      return (typeof value === 'number' && escape === mustache.escape) ? String(value) : escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  Writer.prototype.getConfigTags = function getConfigTags (config) {
    if (isArray(config)) {
      return config;
    }
    else if (config && typeof config === 'object') {
      return config.tags;
    }
    else {
      return undefined;
    }
  };

  Writer.prototype.getConfigEscape = function getConfigEscape (config) {
    if (config && typeof config === 'object' && !isArray(config)) {
      return config.escape;
    }
    else {
      return undefined;
    }
  };

  var mustache = {
    name: 'mustache.js',
    version: '4.2.0',
    tags: [ '{{', '}}' ],
    clearCache: undefined,
    escape: undefined,
    parse: undefined,
    render: undefined,
    Scanner: undefined,
    Context: undefined,
    Writer: undefined,
    /**
     * Allows a user to override the default caching strategy, by providing an
     * object with set, get and clear methods. This can also be used to disable
     * the cache by setting it to the literal `undefined`.
     */
    set templateCache (cache) {
      defaultWriter.templateCache = cache;
    },
    /**
     * Gets the default or overridden caching object from the default writer.
     */
    get templateCache () {
      return defaultWriter.templateCache;
    }
  };

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view`, `partials`, and `config`
   * using the default writer.
   */
  mustache.render = function render (template, view, partials, config) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials, config);
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;

})));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Dictionary_1 = __webpack_require__(4);
var RootComponent_1 = __webpack_require__(1);
window.addEventListener('load', function (event) {
    console.log("app start");
    Dictionary_1.Dictionary.setVocabulary(window.vocabulary || {});
    var rootComponent = new RootComponent_1.RootComponent(window.globalState);
    var rootElement = document.getElementById("app");
    rootComponent.setElement(rootElement);
    rootComponent.render();
});


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.Dictionary = void 0;
function W(id) {
    return Dictionary.getWord(id);
}
exports["default"] = W;
var Dictionary = (function () {
    function Dictionary() {
    }
    Dictionary.setVocabulary = function (vocabulary) {
        Dictionary.vocabulary = vocabulary;
    };
    Dictionary.getVocabulary = function () {
        return Dictionary.vocabulary;
    };
    Dictionary.getWord = function (id) {
        return Dictionary.vocabulary[id] || id;
    };
    Dictionary.vocabulary = {};
    return Dictionary;
}());
exports.Dictionary = Dictionary;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.EventsListener = void 0;
var Logger_1 = __webpack_require__(6);
var EventsListener = (function () {
    function EventsListener(listener) {
        this.events = {};
        this.listener = listener;
    }
    EventsListener.prototype.addEventListener = function (event, listener) {
        var $e = this.listener.getElement();
        listener = this.resolveListener(listener, event);
        if (!listener) {
            throw new Error("Invalid event listener " + listener.toString());
        }
        this.events[event] = listener;
        Logger_1.Logger.debug('listening', "#" + $e.id, event);
        return $e.addEventListener(event, this, false);
    };
    EventsListener.prototype.removeEventListener = function (event) {
        var $e = this.listener.getElement();
        var listener = this.events[event];
        if (!listener) {
            return;
        }
        delete this.events[event];
        return $e.removeEventListener(event, this.resolveListener(listener, event));
    };
    EventsListener.prototype.remove = function () {
    };
    EventsListener.prototype.handleEvent = function (e) {
        var eventType = e.type;
        var listener = this.events[eventType];
        if (listener === undefined) {
            return;
        }
        if (e instanceof MutationEvent) {
            if (e.relatedNode !== this.listener.getElement()) {
                return;
            }
        }
        this.callListener(eventType, e);
    };
    EventsListener.prototype.resolveListener = function (listener, event) {
        if (typeof listener === 'function') {
            return listener;
        }
        else if (typeof listener === 'string' && typeof this.listener[listener] === 'function') {
            return listener;
        }
        else if (typeof this.listener['on' + event.toLowerCase()] === 'function') {
            return 'on' + event.toLowerCase();
        }
        else if (typeof this.listener['on' + event] === 'function') {
            return 'on' + event;
        }
        return undefined;
    };
    EventsListener.prototype.callListener = function (eventType, event) {
        var listener = this.events[eventType];
        if (typeof listener === 'function') {
            listener(event);
        }
        else {
            this.listener[listener](event);
        }
    };
    return EventsListener;
}());
exports.EventsListener = EventsListener;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.Logger = void 0;
var Logger = (function () {
    function Logger() {
    }
    Logger.enable = function (enable) {
        Logger.isEnabled = enable;
    };
    Logger.debug = function (msg) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        Logger.log.apply(Logger, __spreadArrays([msg, 'debug'], optionalParams));
    };
    Logger.info = function (msg) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        Logger.log.apply(Logger, __spreadArrays([msg, 'info'], optionalParams));
    };
    Logger.warn = function (msg) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        Logger.log.apply(Logger, __spreadArrays([msg, 'warn'], optionalParams));
    };
    Logger.error = function (msg) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        Logger.log.apply(Logger, __spreadArrays([msg, 'error'], optionalParams));
    };
    Logger.log = function (msg, type) {
        var optionalParams = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            optionalParams[_i - 2] = arguments[_i];
        }
        if (!Logger.isEnabled) {
            return;
        }
        switch (type) {
            case 'debug':
                console.debug.apply(console, __spreadArrays([msg], optionalParams));
                break;
            case 'info':
                console.info.apply(console, __spreadArrays([msg], optionalParams));
                break;
            case 'warn':
                console.warn.apply(console, __spreadArrays([msg], optionalParams));
                break;
            case 'error':
                console.error.apply(console, __spreadArrays([msg], optionalParams));
                break;
            default:
                console.log.apply(console, __spreadArrays([msg], optionalParams));
        }
    };
    Logger.stringifyParam = function (param) {
        var text;
        alert("2");
        if (param instanceof HTMLElement) {
            var tagName = param.localName.toLowerCase();
            text = " &lt;" + tagName
                + (param.id ? " id=\"" + param.id + "\"" : "")
                + (param.getAttribute('data-is') ? " data-is=\"" + param.getAttribute('data-is') + "\"" : "")
                + "&gt;";
        }
        else if (param === null) {
            text = "NULL";
        }
        else if (param instanceof Object) {
            text = "<i>" + param.toString() + "</i>";
        }
        else {
            text = " " + param.toString();
        }
        return " | " + text;
    };
    Logger.isEnabled = false;
    return Logger;
}());
exports.Logger = Logger;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.BroadcastData = void 0;
var BroadcastData = (function () {
    function BroadcastData(sender, actions) {
        this.actions = {};
        this.sender = sender;
        for (var i = 0, l = actions.length; i < l; i++) {
            var action = actions[i];
            if (typeof action === "string") {
                this.actions[action] = null;
            }
            else {
                this.actions = __assign(__assign({}, this.actions), action);
            }
        }
    }
    BroadcastData.prototype.hasAction = function () {
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        for (var i = 0, l = classes.length; i < l; i++) {
            var a = classes[i];
            if (this.actions[a] !== undefined) {
                return true;
            }
        }
        return false;
    };
    BroadcastData.prototype.getAction = function (action) {
        return (this.actions[action] !== undefined) ? this.actions[action] : null;
    };
    return BroadcastData;
}());
exports.BroadcastData = BroadcastData;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.rerender = exports.enqueueRender = exports.clearRender = void 0;
var items = [];
function clearRender() {
    items = [];
}
exports.clearRender = clearRender;
function enqueueRender(component) {
    if (component.isDirty() && items.push(component) == 1) {
        window.setTimeout(rerender, 0);
    }
}
exports.enqueueRender = enqueueRender;
function rerender() {
    var component, list = items;
    items = [];
    for (var i in list) {
        component = list[i];
        if (component.isDirty() && !component.getParent().isDirty()) {
            component.render();
        }
    }
}
exports.rerender = rerender;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.PageComponent = void 0;
var Component_1 = __webpack_require__(0);
var HeaderComponent_1 = __webpack_require__(10);
var ListComponent_1 = __webpack_require__(11);
var PageComponent = (function (_super) {
    __extends(PageComponent, _super);
    function PageComponent(opts) {
        var _this = _super.call(this, opts) || this;
        _this.addChild('header', new HeaderComponent_1.HeaderComponent(opts.header));
        _this.addChild('list', new ListComponent_1.ListComponent(opts.list));
        return _this;
    }
    PageComponent.prototype.getTemplate = function () {
        return "<div>{{>header}}</div>\n                <div>{{>list}}</div>";
    };
    return PageComponent;
}(Component_1.Component));
exports.PageComponent = PageComponent;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.HeaderComponent = void 0;
var Component_1 = __webpack_require__(0);
var HeaderComponent = (function (_super) {
    __extends(HeaderComponent, _super);
    function HeaderComponent(opts) {
        return _super.call(this, opts) || this;
    }
    HeaderComponent.prototype.getTemplate = function () {
        return "<div style=\"border: 1px solid black\">{{title}}</div>";
    };
    return HeaderComponent;
}(Component_1.Component));
exports.HeaderComponent = HeaderComponent;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ListComponent = void 0;
var Component_1 = __webpack_require__(0);
var TextItemComponent_1 = __webpack_require__(12);
var ListComponent = (function (_super) {
    __extends(ListComponent, _super);
    function ListComponent(props) {
        var _this = _super.call(this, props) || this;
        for (var i = 0; i < props.items.length; i++) {
            _this.addChild(null, new TextItemComponent_1.TextItemComponent(props.items[i]));
        }
        return _this;
    }
    ListComponent.prototype.getRenderedChildren = function () {
        console.log({ children: this.getChildren() });
        return {
            children: this.getChildren()
        };
    };
    ListComponent.prototype.getTemplate = function () {
        return "{{#children}}\n                * {{>getRenderedContent}}\n                {{/children}}";
    };
    return ListComponent;
}(Component_1.Component));
exports.ListComponent = ListComponent;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.TextItemComponent = void 0;
var ItemComponent_1 = __webpack_require__(13);
var TextItemComponent = (function (_super) {
    __extends(TextItemComponent, _super);
    function TextItemComponent(opts) {
        var _this = _super.call(this, opts) || this;
        _this.props = opts;
        return _this;
    }
    TextItemComponent.prototype.getTemplate = function () {
        return "<span style=\"font-weight:bold\">{{description}}:</span>\n                <span>{{value}}</span>";
    };
    return TextItemComponent;
}(ItemComponent_1.ItemComponent));
exports.TextItemComponent = TextItemComponent;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ItemComponent = void 0;
var Component_1 = __webpack_require__(0);
var ItemComponent = (function (_super) {
    __extends(ItemComponent, _super);
    function ItemComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ItemComponent;
}(Component_1.Component));
exports.ItemComponent = ItemComponent;


/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map
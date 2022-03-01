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
//# sourceMappingURL=Dictionary.js.map
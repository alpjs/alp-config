'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = alpConfig;

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

var _deepFreezeEs = require('deep-freeze-es6');

var _deepFreezeEs2 = _interopRequireDefault(_deepFreezeEs);

var _parseJsonObjectAsMap = require('parse-json-object-as-map');

var _parseJsonObjectAsMap2 = _interopRequireDefault(_parseJsonObjectAsMap);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function existsConfig(dirname, name) {
    if (!(typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dirname));
    }

    if (!(typeof name === 'string')) {
        throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
    }

    return (0, _fs.existsSync)('' + dirname + name + '.json');
}

function loadConfig(dirname, name) {
    if (!(typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dirname));
    }

    if (!(typeof name === 'string')) {
        throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
    }

    var content = (0, _fs.readFileSync)('' + dirname + name + '.json');
    return (0, _parseJsonObjectAsMap2.default)(content);
}

function alpConfig(dirname) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!(typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dirname));
    }

    if (!(options instanceof Object)) {
        throw new TypeError('Value of argument "options" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(options));
    }

    dirname = dirname.replace(/\/*$/, '/');

    options = Object.assign({}, options, {
        argv: []
    });

    return function (app) {
        app.existsConfig = function (name) {
            return existsConfig(dirname, name);
        };
        app.loadConfig = function (name) {
            return loadConfig(dirname, name);
        };

        var config = loadConfig(dirname, 'common');
        _loadConfig = loadConfig(dirname, app.env);

        if (!(_loadConfig && (typeof _loadConfig[Symbol.iterator] === 'function' || Array.isArray(_loadConfig)))) {
            throw new TypeError('Expected _loadConfig to be iterable, got ' + _inspect(_loadConfig));
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _loadConfig[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _loadConfig;

                var _step$value = _slicedToArray(_step.value, 2);

                var key = _step$value[0];
                var value = _step$value[1];

                config.set(key, value);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        if (existsConfig(dirname, 'local')) {
            _loadConfig2 = loadConfig(dirname, 'local');

            if (!(_loadConfig2 && (typeof _loadConfig2[Symbol.iterator] === 'function' || Array.isArray(_loadConfig2)))) {
                throw new TypeError('Expected _loadConfig2 to be iterable, got ' + _inspect(_loadConfig2));
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _loadConfig2[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _loadConfig2;

                    var _step2$value = _slicedToArray(_step2.value, 2);

                    var key = _step2$value[0];
                    var value = _step2$value[1];

                    config.set(key, value);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }

        if (!config.has('version')) {
            config.set('version', _minimistArgv2.default.version || options.packageConfig.version);
        }

        var socketPath = _minimistArgv2.default['socket-path'] || _minimistArgv2.default.socketPath;
        if (socketPath) {
            config.set('socketPath', socketPath);
        } else if (_minimistArgv2.default.port) {
            config.set('port', _minimistArgv2.default.port);
            config.delete('socketPath');
        }

        options.argv.forEach(function (key) {
            if (_minimistArgv2.default[key] !== undefined) {
                config.set(key, _minimistArgv2.default[key]);
            }
        });

        app.config = config;
        app.context.config = config;

        return (0, _deepFreezeEs2.default)(config);
    };
}

function _inspect(input, depth) {
    var maxDepth = 4;
    var maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === 'undefined' ? 'undefined' : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(function (item) {
                    return _inspect(item, depth) === first;
                })) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(function (item) {
                            return _inspect(item, depth);
                        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(function (key) {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=index.js.map
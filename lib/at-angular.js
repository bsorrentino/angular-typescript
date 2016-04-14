var at;
(function (at) {
    'use strict';
    function attachInjects(target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (target.$inject || []).forEach(function (item, index) {
            target.prototype[(item.charAt(0) === '$' ? '$' : '$$') + item] = args[index];
        });
        return target;
    }
    at.attachInjects = attachInjects;
    function getOrCreateModule(moduleName, requires) {
        if (requires === void 0) { requires = []; }
        var mod;
        try {
            mod = angular.module(moduleName);
        }
        catch (ex) {
            mod = angular.module(moduleName, requires);
        }
        return mod;
    }
    at.getOrCreateModule = getOrCreateModule;
    function inject() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return function (target, key, index) {
            if (angular.isNumber(index)) {
                target.$inject = target.$inject || [];
                target.$inject[index] = args[0];
            }
            else {
                target.$inject = args;
            }
        };
    }
    at.inject = inject;
    function injectMethod() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return function (target, key, descriptor) {
            target[key].$inject = args;
        };
    }
    at.injectMethod = injectMethod;
    function action(description) {
        return function (target, key, descriptor) {
            target[key].description = description;
        };
    }
    at.action = action;
    function failSafe(moduleName, serviceName, handlerProviderName) {
        if (handlerProviderName === void 0) { handlerProviderName = 'exceptionHandlerProvider'; }
        return function (target) {
            getOrCreateModule(moduleName).config([handlerProviderName, '$provide', function (exceptionHandlerProvider, $provide) {
                    exceptionHandlerProvider.decorate($provide, [serviceName]);
                }]);
        };
    }
    at.failSafe = failSafe;
    function service(moduleName, serviceName) {
        return function (target) {
            getOrCreateModule(moduleName).service(serviceName, target);
        };
    }
    at.service = service;
    function provider(moduleName, providerName) {
        return function (target) {
            getOrCreateModule(moduleName).provider(providerName, target);
        };
    }
    at.provider = provider;
    function filter(moduleName, filterName) {
        return function (target) {
            var Provider = (function () {
                function Provider() {
                    this.$get = function () {
                        var deps = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            deps[_i - 0] = arguments[_i];
                        }
                        return new (target.bind.apply(target, [void 0].concat(deps)))().transform;
                    };
                    this.$get.$inject = (target.$inject || []).slice();
                }
                return Provider;
            })();
            getOrCreateModule(moduleName).provider(filterName + 'Filter', Provider);
        };
    }
    at.filter = filter;
    function valueObj(moduleName, valueName) {
        return function (target) {
            getOrCreateModule(moduleName).value(valueName, target);
        };
    }
    at.valueObj = valueObj;
    function valueProp(moduleName, valueName) {
        return function (target, key) {
            getOrCreateModule(moduleName).value(valueName || key, target[key]);
        };
    }
    at.valueProp = valueProp;
    function valueFunc(moduleName, valueName) {
        return function (target, key, descriptor) {
            getOrCreateModule(moduleName).value(valueName || key, target[key]);
        };
    }
    at.valueFunc = valueFunc;
    function constantObj(moduleName, valueName) {
        return function (target) {
            getOrCreateModule(moduleName).constant(valueName, new target());
        };
    }
    at.constantObj = constantObj;
    function constantProp(moduleName, valueName) {
        return function (target, key) {
            getOrCreateModule(moduleName).constant(valueName || key, target[key]);
        };
    }
    at.constantProp = constantProp;
    function constantFunc(moduleName, valueName) {
        return function (target, key, descriptor) {
            getOrCreateModule(moduleName).constant(valueName || key, target[key]);
        };
    }
    at.constantFunc = constantFunc;
    function controller(moduleName, ctrlName) {
        return function (target) {
            getOrCreateModule(moduleName).controller(ctrlName, target);
        };
    }
    at.controller = controller;
    var componentProperties = [
        'controller',
        'controllerAs',
        'bindings',
        'require',
        'template',
        'templateUrl',
        'transclude'
    ];
    function component(moduleName, componentName, componentConfig) {
        return function (target) {
            var config;
            if (componentConfig) {
                componentConfig.controller || (componentConfig.controller = target);
                config = componentConfig;
            }
            else {
                config = componentProperties.reduce(function (config, property) {
                    return angular.isDefined(target[property]) ?
                        angular.extend(config, (_a = {}, _a[property] = target[property], _a)) :
                        config;
                    var _a;
                }, { controller: target });
            }
            getOrCreateModule(moduleName).component(componentName, config);
        };
    }
    at.component = component;
    var directiveProperties = [
        'compile',
        'controller',
        'controllerAs',
        'bindToController',
        'link',
        'priority',
        'replace',
        'require',
        'restrict',
        'scope',
        'template',
        'templateUrl',
        'terminal',
        'transclude'
    ];
    function directive(moduleName, directiveName, directiveConfig) {
        return function (target) {
            var ctrlCfg = directiveConfig ? directiveConfig.controller : target.controller;
            var ctrlAs = directiveConfig ? directiveConfig.controllerAs : target.controllerAs;
            if (ctrlCfg) {
                var ctrlName = angular.isString(ctrlCfg) ? ctrlCfg.split(' ').shift() : null;
                if (ctrlName) {
                    controller(moduleName, ctrlName)(target);
                }
            }
            else {
                directiveConfig && (directiveConfig.controller = target);
            }
            if (!ctrlAs) {
                ctrlAs = angular.isString(ctrlCfg) ? ctrlCfg.split(' ').pop() : null;
                if (!ctrlAs) {
                    if (directiveConfig)
                        directiveConfig.controllerAs = 'vm';
                    else
                        target.controllerAs = 'vm';
                }
            }
            var config;
            if (directiveConfig) {
                config = directiveConfig;
            }
            else {
                config = directiveProperties.reduce(function (config, property) {
                    return angular.isDefined(target[property]) ? angular.extend(config, (_a = {}, _a[property] = target[property], _a)) :
                        config;
                    var _a;
                }, { controller: target, scope: Boolean(target.templateUrl) });
            }
            getOrCreateModule(moduleName).directive(directiveName, function () { return (config); });
        };
    }
    at.directive = directive;
})(at || (at = {}));

//# sourceMappingURL=at-angular.js.map

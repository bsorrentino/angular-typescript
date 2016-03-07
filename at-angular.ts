
module at {

    'use strict';

    /* tslint:disable:no-any */
    export interface IClassAnnotationDecorator {
        (target: any): void;
        (t: any, key: string, index: number): void;
    }

    export function attachInjects(target: any, ...args: any[]): any {
        (target.$inject || []).forEach((item: string, index: number) => {
            target.prototype[(item.charAt(0) === '$' ? '$' : '$$') + item] = args[index];
        });
        return target;
    }

    /**
     * return a module. If module doesn't exist it will be created
     */
    export function getOrCreateModule( moduleName: string, requires: string[] = []): angular.IModule {
      let mod: angular.IModule;
      try {
          mod = angular.module(moduleName);
      } catch ( ex ) {
          mod = angular.module(moduleName, requires);
      }

      return mod;
    }

///////////////////////////////////////////////////////////////////////////////
// INJECT ANNOTATION
///////////////////////////////////////////////////////////////////////////////

    export interface IInjectAnnotation {
        (...args: any[]): IClassAnnotationDecorator;
    }

    /**
     * inject an argument
     */
    export function inject(...args: string[]): at.IClassAnnotationDecorator {
        return (target: any, key?: string, index?: number): void => {
            if (angular.isNumber(index)) {
                target.$inject = target.$inject || [];
                target.$inject[index] = args[0];
            } else {
                target.$inject = args;
            }
        };
    }
///////////////////////////////////////////////////////////////////////////////
// SERVICE ANNOTATION
///////////////////////////////////////////////////////////////////////////////

    export interface IServiceAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }

    /**
     * inject a service
     */
    export function service(moduleName: string, serviceName: string): at.IClassAnnotationDecorator {
        return (target: any): void => {
           getOrCreateModule(moduleName).service( serviceName, target);
        };

    }

///////////////////////////////////////////////////////////////////////////////
// CONTROLLER ANNOTATION
///////////////////////////////////////////////////////////////////////////////

    export interface IControllerAnnotation {
        (moduleName: string, ctrlName: string): IClassAnnotationDecorator;
    }

    /**
     * Inject a controller
     */
    export function controller(moduleName: string, ctrlName: string): at.IClassAnnotationDecorator {
        return (target: any): void => {
           getOrCreateModule(moduleName).controller( ctrlName, target);
        };

    }

///////////////////////////////////////////////////////////////////////////////
// COMPONENT ANNOTATION
///////////////////////////////////////////////////////////////////////////////
    const componentProperties: string[] = [
        'controller',
        'controllerAs',
        'bindings',
        'require',
        'template',
        'templateUrl',
        'transclude'
    ];

    export interface IComponentAnnotation {
        (moduleName: string, componentName: string): IClassAnnotationDecorator;
    }

    /**
     * inject a component
     */
    export function component(moduleName: string, componentName: string): at.IClassAnnotationDecorator {
        return (target: any): void => {
            let config: angular.IComponentOptions;
            
            config = componentProperties.reduce((
                config: angular.IComponentOptions,
                property: string
            ) => {
                return angular.isDefined(target[property]) ? 
                    angular.extend(config, {[property]: target[property]}) :
                    config; 
            }, {controller: target});

            getOrCreateModule(moduleName).component(componentName, config);
        };
    }

///////////////////////////////////////////////////////////////////////////////
// DIRECTIVE ANNOTATION
///////////////////////////////////////////////////////////////////////////////
    const directiveProperties: string[] = [
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

    export interface IDirectiveAnnotation {
        (moduleName: string, directiveName: string): IClassAnnotationDecorator;
    }

    /**
     * inject a directive
     */
    export function directive(moduleName: string, directiveName: string): at.IClassAnnotationDecorator {
        return (target: any): void => {
            let config: angular.IDirective;
            const ctrlName: string = angular.isString(target.controller) ? target.controller.split(' ').shift() : null;
            /* istanbul ignore else */
            if (ctrlName) {
                controller(moduleName, ctrlName)(target);
            }
            config = directiveProperties.reduce((
                config: angular.IDirective,
                property: string
            ) => {
                return angular.isDefined(target[property]) ? angular.extend(config, {[property]: target[property]}) :
                    config; /* istanbul ignore next */
            }, {controller: target, scope: Boolean(target.templateUrl)});

            getOrCreateModule(moduleName).directive(directiveName, () => (config));
        };
    }

///////////////////////////////////////////////////////////////////////////////
// CLASSFACTORY ANNOTATION
///////////////////////////////////////////////////////////////////////////////

    export interface IClassFactoryAnnotation {
        (moduleName: string, className: string): IClassAnnotationDecorator;
    }

    export function classFactory(moduleName: string, className: string): at.IClassAnnotationDecorator {
        return (target: any): void => {
            function factory(...args: any[]): any {
                return at.attachInjects(target, ...args);
            }
            /* istanbul ignore else */
            if (target.$inject && target.$inject.length > 0) {
                factory.$inject = target.$inject.slice(0);
            }
            getOrCreateModule(moduleName).factory(className, factory);
        };
    }
    /* tslint:enable:no-any */

}

module at {

  'use strict';

  /* tslint:disable:no-any */
  export interface IClassAnnotationDecorator {
    (target: any): void;
    (t: any, key: string, index: number): void;
  }

  export interface IPropertyAnnotationDecorator {
    (target: any, key: string): void;
  }

  export interface IMethodAnnotationDecorator {
    (target: any, key: string, descriptor: TypedPropertyDescriptor<any>): void;
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
  export function getOrCreateModule(moduleName: string, requires: string[] = []): angular.IModule {
    let mod: angular.IModule;
    try {
      mod = angular.module(moduleName);
    } catch (ex) {
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

  export function injectMethod(...args: string[]): at.IMethodAnnotationDecorator {
    return (target: any, key: string, descriptor: TypedPropertyDescriptor<any>): void => {
      target[key].$inject = args;
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
      getOrCreateModule(moduleName).service(serviceName, target);
    };

  }

  ///////////////////////////////////////////////////////////////////////////////
  // PROVIDER ANNOTATION
  ///////////////////////////////////////////////////////////////////////////////

  export interface IProviderAnnotation {
    (moduleName: string, providerName: string): IClassAnnotationDecorator;
  }

  /**
   * inject a provider
   */
  export function provider(moduleName: string, providerName: string): at.IClassAnnotationDecorator {
    return (target: any): void => {
      getOrCreateModule(moduleName).provider(providerName, target);
    };

  }

  ///////////////////////////////////////////////////////////////////////////////
  // FILTER ANNOTATION
  ///////////////////////////////////////////////////////////////////////////////

  export interface IFilter {
    transform(input: any, ...args: any[]): any;
  }

  export interface IFilterAnnotation {
    (moduleName: string, filterName: string): IClassAnnotationDecorator;
  }

  /**
   * inject a provider
   */
  export function filter(moduleName: string, filterName: string): at.IClassAnnotationDecorator {
    return (target: any): void => {
      class Provider {
        constructor() {
          this.$get.$inject = (target.$inject || []).slice();
        }
        public $get = (...deps) => new target(...deps).transform;
      }
      getOrCreateModule(moduleName).provider(filterName + 'Filter', Provider);
    };

  }
  ///////////////////////////////////////////////////////////////////////////////
  // VALUE ANNOTATION
  ///////////////////////////////////////////////////////////////////////////////

  export interface IValueAnnotation {
    (moduleName: string, valueName: string): IClassAnnotationDecorator;
  }

  export function valueObj(moduleName: string, valueName: string): at.IClassAnnotationDecorator {
    return (target: any): void => {
      getOrCreateModule(moduleName).value(valueName, target);
    };
  }

  export function valueProp(moduleName: string, valueName?: string): at.IPropertyAnnotationDecorator {
    return (target: any, key: string): void => {
      getOrCreateModule(moduleName).value(valueName || key, target[key]);
    };
  }

  export function valueFunc(moduleName: string, valueName?: string): at.IMethodAnnotationDecorator {
    return (target: any, key: string, descriptor: TypedPropertyDescriptor<any>): void => {
      getOrCreateModule(moduleName).value(valueName || key, target[key]);
    };
  }

  ///////////////////////////////////////////////////////////////////////////////
  // CONSTANT ANNOTATION
  ///////////////////////////////////////////////////////////////////////////////

  export interface IConstantAnnotation {
    (moduleName: string, valueName: string): IClassAnnotationDecorator;
  }

  export function constantObj(moduleName: string, valueName: string): at.IClassAnnotationDecorator {
    return (target: any): void => {
      getOrCreateModule(moduleName).constant(valueName, target);
    };
  }

  export function constantProp(moduleName: string, valueName?: string): at.IPropertyAnnotationDecorator {
    return (target: any, key: string): void => {
      getOrCreateModule(moduleName).constant(valueName || key, target[key]);
    };
  }

  export function constantFunc(moduleName: string, valueName?: string): at.IMethodAnnotationDecorator {
    return (target: any, key: string, descriptor: TypedPropertyDescriptor<any>): void => {
      getOrCreateModule(moduleName).constant(valueName || key, target[key]);
    };
  }

  ///////////////////////////////////////////////////////////////////////////////
  // CONTROLLER ANNOTATION
  ///////////////////////////////////////////////////////////////////////////////

  /**
   * @link http://angular.github.io/router/lifecycle
   */
  export interface IController {
    canActivate?(): boolean | angular.IPromise<boolean>;
    activate?(): any;
    canDeactivate?(): boolean | angular.IPromise<boolean>;
    deactivate?(): any;
  }

  export interface IControllerAnnotation {
    (moduleName: string, ctrlName: string): IClassAnnotationDecorator;
  }

  /**
   * Inject a controller
   */
  export function controller(moduleName: string, ctrlName: string): at.IClassAnnotationDecorator {
    return (target: any): void => {
      getOrCreateModule(moduleName).controller(ctrlName, target);
    };

  }

  ///////////////////////////////////////////////////////////////////////////////
  // COMPONENT ANNOTATION
  ///////////////////////////////////////////////////////////////////////////////

  export interface OnInit {
    $onInit(): void;
  }

  /**
   * RouteData is an immutable map of additional data you can configure in your Route.
   * You can inject RouteData into the constructor of a component to use it.
   */
  export interface RouteData {
    data: { [key: string]: any };
    get(key: string): any;
  }

  /**
   * A `ComponentInstruction` represents the route state for a single component. An `Instruction` is
   * composed of a tree of these `ComponentInstruction`s.
   *
   * `ComponentInstructions` is a public API. Instances of `ComponentInstruction` are passed
   * to route lifecycle hooks, like {@link CanActivate}.
   *
   * `ComponentInstruction`s are [https://en.wikipedia.org/wiki/Hash_consing](hash consed). You should
   * never construct one yourself with "new." Instead, rely on {@link Router/RouteRecognizer} to
   * construct `ComponentInstruction`s.
   *
   * You should not modify this object. It should be treated as immutable.
   */
  export interface ComponentInstruction {
    reuse: boolean;
    routeData: RouteData;
    urlPath: string;
    urlParams: string[];
    data: RouteData;
    componentType: any;
    terminal: boolean;
    specificity: number;
    params: { [key: string]: any };
  }

  /**
   * Defines route lifecycle method `routerOnActivate`, which is called by the router at the end of a
   * successful route navigation.
   *
   * For a single component's navigation, only one of either {@link OnActivate} or {@link OnReuse}
   * will be called depending on the result of {@link CanReuse}.
   *
   * The `routerOnActivate` hook is called with two {@link ComponentInstruction}s as parameters, the
   * first
   * representing the current route being navigated to, and the second parameter representing the
   * previous route or `null`.
   *
   * If `routerOnActivate` returns a IPromise, the route change will wait until the IPromise settles to
   * instantiate and activate child components.
   *
   * ### Example
   * {@example router/ts/on_activate/on_activate_example.ts region='routerOnActivate'}
   */
  export interface OnActivate {
    $routerOnActivate(next?: ComponentInstruction, prev?: ComponentInstruction): any;
  }

  /**
   * Defines route lifecycle method `routerCanDeactivate`, which is called by the router to determine
   * if a component can be removed as part of a navigation.
   *
   * The `routerCanDeactivate` hook is called with two {@link ComponentInstruction}s as parameters,
   * the
   * first representing the current route being navigated to, and the second parameter
   * representing the previous route.
   *
   * If `routerCanDeactivate` returns or resolves to `false`, the navigation is cancelled. If it
   * returns or
   * resolves to `true`, then the navigation continues, and the component will be deactivated
   * (the {@link OnDeactivate} hook will be run) and removed.
   *
   * If `routerCanDeactivate` throws or rejects, the navigation is also cancelled.
   *
   * ### Example
   * {@example router/ts/can_deactivate/can_deactivate_example.ts region='routerCanDeactivate'}
   */
  export interface CanDeactivate {
    $routerCanDeactivate(next?: ComponentInstruction, prev?: ComponentInstruction): boolean | angular.IPromise<boolean>;
  }

  /**
   * Defines route lifecycle method `routerOnDeactivate`, which is called by the router before
   * destroying
   * a component as part of a route change.
   *
   * The `routerOnDeactivate` hook is called with two {@link ComponentInstruction}s as parameters, the
   * first
   * representing the current route being navigated to, and the second parameter representing the
   * previous route.
   *
   * If `routerOnDeactivate` returns a IPromise, the route change will wait until the IPromise settles.
   *
   * ### Example
   * {@example router/ts/on_deactivate/on_deactivate_example.ts region='routerOnDeactivate'}
   */
  export interface OnDeactivate {
    $routerOnDeactivate(next?: ComponentInstruction, prev?: ComponentInstruction): any;
  }

  /**
   * Defines route lifecycle method `routerCanReuse`, which is called by the router to determine
   * whether a
   * component should be reused across routes, or whether to destroy and instantiate a new component.
   *
   * The `routerCanReuse` hook is called with two {@link ComponentInstruction}s as parameters, the
   * first
   * representing the current route being navigated to, and the second parameter representing the
   * previous route.
   *
   * If `routerCanReuse` returns or resolves to `true`, the component instance will be reused and the
   * {@link OnDeactivate} hook will be run. If `routerCanReuse` returns or resolves to `false`, a new
   * component will be instantiated, and the existing component will be deactivated and removed as
   * part of the navigation.
   *
   * If `routerCanReuse` throws or rejects, the navigation will be cancelled.
   *
   * ### Example
   * {@example router/ts/reuse/reuse_example.ts region='reuseCmp'}
   */
  export interface CanReuse {
    $routerCanReuse(next?: ComponentInstruction, prev?: ComponentInstruction): boolean | angular.IPromise<boolean>;
  }

  /**
   * Defines route lifecycle method `routerOnReuse`, which is called by the router at the end of a
   * successful route navigation when {@link CanReuse} is implemented and returns or resolves to true.
   *
   * For a single component's navigation, only one of either {@link OnActivate} or {@link OnReuse}
   * will be called, depending on the result of {@link CanReuse}.
   *
   * The `routerOnReuse` hook is called with two {@link ComponentInstruction}s as parameters, the
   * first
   * representing the current route being navigated to, and the second parameter representing the
   * previous route or `null`.
   *
   * ### Example
   * {@example router/ts/reuse/reuse_example.ts region='reuseCmp'}
   */
  export interface OnReuse {
    $routerOnReuse(next?: ComponentInstruction, prev?: ComponentInstruction): any;
  }

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
  export function component(moduleName: string, componentName: string, componentConfig?: angular.IComponentOptions): at.IClassAnnotationDecorator {
    return (target: any): void => {
      let config: angular.IComponentOptions;

      if (componentConfig) {
        componentConfig.controller || (componentConfig.controller = target);
        config = componentConfig;
      } else {
        config = componentProperties.reduce((
          config: angular.IComponentOptions,
          property: string
        ) => {
          return angular.isDefined(target[property]) ?
            angular.extend(config, { [property]: target[property] }) :
            config;
        }, { controller: target });
      }

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
  export function directive(moduleName: string, directiveName: string, directiveConfig?: angular.IDirective): at.IClassAnnotationDecorator {
    return (target: any): void => {
      const ctrlCfg = directiveConfig ? directiveConfig.controller : target.controller;
      let ctrlAs: string = directiveConfig ? directiveConfig.controllerAs : target.controllerAs;
      if (ctrlCfg) {
        const ctrlName: string = angular.isString(ctrlCfg) ? ctrlCfg.split(' ').shift() : null;
        /* istanbul ignore else */
        if (ctrlName) {
          controller(moduleName, ctrlName)(target);
        }
      } else {
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

      let config: angular.IDirective;
      if (directiveConfig) {
        config = directiveConfig;
      } else {
        config = directiveProperties.reduce((
          config: angular.IDirective,
          property: string
        ) => {
          return angular.isDefined(target[property]) ? angular.extend(config, { [property]: target[property] }) :
            config; /* istanbul ignore next */
        }, { controller: target, scope: Boolean(target.templateUrl) });
      }

      getOrCreateModule(moduleName).directive(directiveName, () => (config));
    };
  }
  /* tslint:enable:no-any */

}

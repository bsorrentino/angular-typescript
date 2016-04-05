declare module at {
    interface IClassAnnotationDecorator {
        (target: any): void;
        (t: any, key: string, index: number): void;
    }
    interface IPropertyAnnotationDecorator {
        (target: any, key: string): void;
    }
    interface IMethodAnnotationDecorator {
        (target: any, key: string, descriptor: TypedPropertyDescriptor<any>): void;
    }
    function attachInjects(target: any, ...args: any[]): any;
    function getOrCreateModule(moduleName: string, requires?: string[]): angular.IModule;
    interface IInjectAnnotation {
        (...args: any[]): IClassAnnotationDecorator;
    }
    function inject(...args: string[]): at.IClassAnnotationDecorator;
    function injectMethod(...args: string[]): at.IMethodAnnotationDecorator;
    interface IServiceAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }
    function service(moduleName: string, serviceName: string): at.IClassAnnotationDecorator;
    interface IProviderAnnotation {
        (moduleName: string, providerName: string): IClassAnnotationDecorator;
    }
    function provider(moduleName: string, providerName: string): at.IClassAnnotationDecorator;
    interface IFilter {
        transform(input: any, ...args: any[]): any;
    }
    interface IFilterAnnotation {
        (moduleName: string, filterName: string): IClassAnnotationDecorator;
    }
    function filter(moduleName: string, filterName: string): at.IClassAnnotationDecorator;
    interface IValueAnnotation {
        (moduleName: string, valueName: string): IClassAnnotationDecorator;
    }
    function valueObj(moduleName: string, valueName: string): at.IClassAnnotationDecorator;
    function valueProp(moduleName: string, valueName?: string): at.IPropertyAnnotationDecorator;
    function valueFunc(moduleName: string, valueName?: string): at.IMethodAnnotationDecorator;
    interface IConstantAnnotation {
        (moduleName: string, valueName: string): IClassAnnotationDecorator;
    }
    function constantObj(moduleName: string, valueName: string): at.IClassAnnotationDecorator;
    function constantProp(moduleName: string, valueName?: string): at.IPropertyAnnotationDecorator;
    function constantFunc(moduleName: string, valueName?: string): at.IMethodAnnotationDecorator;
    interface IController {
        canActivate?(): boolean | angular.IPromise<boolean>;
        activate?(): any;
        canDeactivate?(): boolean | angular.IPromise<boolean>;
        deactivate?(): any;
    }
    interface IControllerAnnotation {
        (moduleName: string, ctrlName: string): IClassAnnotationDecorator;
    }
    function controller(moduleName: string, ctrlName: string): at.IClassAnnotationDecorator;
    interface OnInit {
        $onInit(): void;
    }
    interface IChange<T> {
        currentValue: T;
        previousValue: T;
    }
    interface OnChanges {
        $onChanges(changes: any): void;
    }
    interface OnDestroy {
        $onDestroy(): void;
    }
    interface RouteData {
        data: {
            [key: string]: any;
        };
        get(key: string): any;
    }
    interface ComponentInstruction {
        reuse: boolean;
        routeData: RouteData;
        urlPath: string;
        urlParams: string[];
        data: RouteData;
        componentType: any;
        terminal: boolean;
        specificity: number;
        params: {
            [key: string]: any;
        };
    }
    interface OnActivate {
        $routerOnActivate(next?: ComponentInstruction, prev?: ComponentInstruction): any;
    }
    interface CanDeactivate {
        $routerCanDeactivate(next?: ComponentInstruction, prev?: ComponentInstruction): boolean | angular.IPromise<boolean>;
    }
    interface OnDeactivate {
        $routerOnDeactivate(next?: ComponentInstruction, prev?: ComponentInstruction): any;
    }
    interface CanReuse {
        $routerCanReuse(next?: ComponentInstruction, prev?: ComponentInstruction): boolean | angular.IPromise<boolean>;
    }
    interface OnReuse {
        $routerOnReuse(next?: ComponentInstruction, prev?: ComponentInstruction): any;
    }
    interface IComponentAnnotation {
        (moduleName: string, componentName: string): IClassAnnotationDecorator;
    }
    function component(moduleName: string, componentName: string, componentConfig?: angular.IComponentOptions): at.IClassAnnotationDecorator;
    interface IDirectiveAnnotation {
        (moduleName: string, directiveName: string): IClassAnnotationDecorator;
    }
    function directive(moduleName: string, directiveName: string, directiveConfig?: angular.IDirective): at.IClassAnnotationDecorator;
}

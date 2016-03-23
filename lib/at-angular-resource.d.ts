/// <reference path="../typings/main.d.ts" />
declare module at {
    type ResourceArray = angular.resource.IResourceArray<any>;
    class Resource implements angular.resource.IResource<Resource> {
        static get: (params?: Object) => Resource;
        static query: (params?: Object) => ResourceArray;
        static remove: () => Resource;
        static save: () => Resource;
        static delete: () => Resource;
        constructor(model?: any);
        $get: (params?: Object) => angular.IPromise<this>;
        $query: (params?: Object) => angular.IPromise<angular.resource.IResourceArray<this>>;
        $remove: (params?: Object) => angular.IPromise<this>;
        $save: (params?: Object) => angular.IPromise<this>;
        $delete: (params?: Object) => angular.IPromise<this>;
        $promise: angular.IPromise<this>;
        $resolved: boolean;
        toJSON: () => {
            [index: string]: any;
        };
    }
    class ResourceWithUpdate extends Resource {
        constructor(model?: any);
        static update: () => ResourceWithUpdate;
        $update: () => angular.IPromise<this>;
        $promise: angular.IPromise<this>;
    }
    interface IResourceAnnotation {
        (moduleName: string, className: string): at.IClassAnnotationDecorator;
    }
    function resource(moduleName: string, className: string): at.IClassAnnotationDecorator;
}

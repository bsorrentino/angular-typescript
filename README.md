# Angular15-TypeScript

TypeScript 1.7+ annotations (decorators) for AngularJS 1.5

> Such project is an extension of the [angular-typescript](https://github.com/ulfryk/angular-typescript) from [ulfryk](https://github.com/ulfryk) to support new Angular 1.5 features (mainly the **component** element)

## install from npm

```
npm install angular15-typescript
```

## Available Decorators

**angular15-typescript** provides annotation like decorators:

```
@at.service(moduleName: string, serviceName: string)
@at.inject(dependencyOne: string, ...dependencies?: string[])
@at.controller(moduleName: string, controllerName: string)
@at.directive(moduleName: string, directiveName: string, directiveConfig?: angular.IDirective)
@at.resource(moduleName: string, resourceClassName: string)

@at.provider(moduleName: string, providerName: string)
@at.filter(moduleName: string, filterName: string)
@at.filter(moduleName: string, filterName: string)

@at.component(moduleName: string, componentName: string, componentConfig?: angular.IComponentOptions)

@at.valueObj(moduleName: string, valueName: string)
@at.valueProp(moduleName: string, valueName?: string)
@at.valueFunc(moduleName: string, valueName?: string)

@at.constantObj(moduleName: string, valueName: string)
@at.constantProp(moduleName: string, valueName?: string)
@at.constantFunc(moduleName: string, valueName?: string)

```

## Goal

Purpose of those decorators is to remove some ugly boilerplate from AngularJS applications written in TypeScript and in the same time promoting use a programming model  as close as possible to  AngularJS 2

## How to

### Service

Now one have to:

```typescript
class SomeService {

    constructor() {
        // do stuff $http and $parse
    }

    public someMethod(anArg: number): boolean {
        // do some stuff
    }

}

angular.module('ngModuleName').service('someService', SomeService);
```

Using **angular-typescript** it will look like:

```typescript
@service('ngModuleName', 'someService')
class SomeService {

    constructor() {
        // do stuff
    }

    public someMethod(anArg: number): boolean {
        // do some stuff
    }

}
```

***

### Inject

```typescript
@service('ngModuleName', 'someServiceName')
class SomeService {

    constructor(
        @inject('$http') $http: angular.IHttpService,
        @inject('$parse') private $$parse: angular.IParseService
    ) {
        // do stuff with $http and $$parse;
    }

    public someMethod(anArg: number): boolean {
        // do some stuff with this.$$parse
    }

}
```

or

```typescript
@service('ngModuleName', 'someServiceName')
@inject('$http', '$parse')
class SomeService {

    constructor(
        $http: angular.IHttpService,
        private $$parse: angular.IParseService
    ) {
        // do stuff with $http and $$parse;
    }

    public someMethod(anArg: number): boolean {
        // do some stuff with this.$$parse();
    }

}
```

***

### Controller


```typescript
@controller('ngModuleName', 'SomeController')
class SomeController {

    constructor(
        @inject('$scope') $scope: angular.IScope,
        @inject('$parse') private $$parse: angular.IParseService
    ) {
        // do stuff with $scope and $$parse;
    }

    public someMethod(anArg: number): boolean {
        // do some stuff with this.$$parse();
    }

}
```

***

### Component

```typescript
@at.component(moduleName, 'featureTest', {
  template: () => '<span>{{ $ctrl.test }}</span>'
})
@at.inject('$log')
export class Feature1Component implements at.IComponent {

  public test = 'Feature1Component';

  public static template: angular.IComponentTemplateFn = () => {
    return '<span>{{ $ctrl.name }}</span>';
  };

  constructor(private log: angular.ILogService) {
    log.debug('Feature1 constructor');
  }

  public $onInit(): void {
    this.log.debug('Feature1 $onInit');
  }

}
```

***

### Filter

```typescript
mport ngModuleName from './example.module';

'use strict';

const ngFilterName = 'example';

@at.filter(ngModuleName, ngFilterName)
@at.inject('$log')
export default class ExampleFilter implements at.IFilter {

  constructor(private log: angular.ILogService) {
    log.debug(['ngFilter', ngFilterName, 'loaded'].join(' '));
  }

  public transform = (input: string | Array<any>): number => !input ? 0 : input.length;

}
```

***

### Provider

```typescript
import ngModuleName from './example.module';

'use strict';

// the provider will be available as 'sampleProvider'
// the created service will be available as 'sample'
const ngProviderName = 'sample';

interface IExampleProvider extends angular.IServiceProvider {
  makeNoise(value: boolean): void;
}

@at.provider(ngModuleName, ngProviderName)
export class ExampleProvider implements IExampleProvider {
  private notify = true;

  constructor() {
    this.notify = true;
  }

  public makeNoise(value: boolean): void {
    this.notify = value;
  }

  // $get must be declared as method, not as function property (eg. `$get = () => new Service();`)
  @at.injectMethod('$log')
  public $get(log: angular.ILogService) {
    return new ExampleProviderService(log, this.notify);
  }
}

export default class ExampleProviderService {
  constructor(private log: angular.ILogService, private notify: boolean) {
    let s = ['ngProvider', ngProviderName, 'has loaded an', 'ExampleProviderService'].join(' ');
    if (notify)
      log.info(s);
    else
      log.debug(s);
  }
}

```

***

### Directive

```typescript
import ngModuleName from './message.module';

'use strict';

const ngDirectiveName = 'tsfnMessageSection';

@at.directive(ngModuleName, ngDirectiveName, {
  restrict: 'E',
  scope: {},
  bindToController: {
    title: '@',
    theme: '@',
    messages: '='
  },
  templateUrl: 'message/message-section.directive.html'
})

export default class MessagesSectionDirective {

}
```

***


### Resource

It encapsulates magic powers of angular $resource. $resource configs are gathered from static class members.

```typescript
@resource('test', 'UserResource')
@inject('$http', '$parse')
class UserResource extends at.Resource {

    public static url: string = '/fake/url';

    public name: string;
    public age: number;

    private $$http: angular.IHttpService;
    private $$parse: angular.IParseService;

    constructor(model?: ITestModel) {
        if (model) {
            this.name = model.name;
            this.age = model.age;
        }
    }

    public getLabel(): string {
        return `${ this.name }-${ String(this.age) }`;
    }

}
```

***

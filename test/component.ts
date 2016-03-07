/// <reference path="../typings/browser.d.ts"/>

module test {

    'use strict';

    @at.component('test', 'TestRealComponentCtrl')
    export class TestRealComponentCtrl {

        public static template: angular.IComponentTemplateFn = (tElement: angular.IAugmentedJQuery) => {
            tElement.addClass('test-component');
            return '<span>{{ name }}</span><span>{{ $ctrl.name }}</span>';
        };

        // And the rest are simple Ctrl instance members
        public name: string;

        constructor(
            /* tslint:disable:variable-name */
            @at.inject('$parse') private $$parse: angular.IParseService
            /* tslint:enable:variable-name */
        ) {
            this.name = 'FirstTestCtrl';
        }

        public $onInit(): void  {
          this.$$parse('name').assign(this, name);
        }

    }

}


/*
describe('# About Controller', () => {
  let $component, $scope, component;

  beforeEach(() => {
    angular.mock.module('test');

    angular.mock.inject(_$component_ => {
      $component = _$component_;
    });

    component = $component('TestRealComponentCtrl', {});
  });

  it('should be an instance of TestRealComponentCtrl component', () => {
    expect(component).toEqual( jasmine.any(test.TestRealComponentCtrl) );
  });

  it('should have propertis list, names', () => {
    expect(controller).to.have.property('names');
    expect(controller).to.have.property('list');
  });
  it('should add() a name and update the names list', () => {
    let lastValue;
    controller.addName('test');
    lastValue = controller.names.pop();
    expect(lastValue).to.equal('test');
  })
});
*/

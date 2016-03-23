/// <reference path="../typings/main.d.ts"/>

module test {

    'use strict';

    @at.component('test', 'testComponent')
    export class TestComponent {

        public static template: angular.IComponentTemplateFn = () => {
            return '<span>{{ $ctrl.name }}</span>';
        };

        // And the rest are simple Ctrl instance members
        public name: string;

        constructor() {
            this.name = 'FirstTestCtrl';
        }

        public $onInit(): void {
        }

    }

}

describe('test-component', () => {

    it('TestComponent must be defned', () => {
        expect(test.TestComponent).toBeDefined();
    });

});

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

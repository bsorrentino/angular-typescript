module test {

    'use strict';

    @component('test', 'atTestRealComponent')
    export class TestRealComponentCtrl {

        public static template: angular.IComponentTemplateFn = (tElement: angular.IAugmentedJQuery) => {
            tElement.addClass('test-component');
            return '<span>{{ name }}</span><span>{{ $ctrl.name }}</span>';
        };

        // And the rest are simple Ctrl instance members
        public name: string;

        constructor(
            /* tslint:disable:variable-name */
            @inject('$parse') private $$parse: angular.IParseService
            /* tslint:enable:variable-name */
        ) {
            this.name = 'FirstTestCtrl';
        }

        public $onInit(): void  {
          this.$$parse('name').assign(this, name);
        }

    }

}

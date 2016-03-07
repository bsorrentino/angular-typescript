// Compiled using typings@0.6.10
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/661e01689612eeb784e931e4f5274d4ea5d588b7/karma-jasmine/karma-jasmine.d.ts
// Type definitions for karma-jasmine plugin
// Project: https://github.com/karma-runner/karma-jasmine
// Definitions by: Michel Salib <https://github.com/michelsalib>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare function fdescribe(description: string, specDefinitions: () => void): void;
declare function fit(expectation: string, assertion: () => void): void;
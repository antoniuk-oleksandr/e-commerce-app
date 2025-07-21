"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^@test/(.*)$': '<rootDir>/test/$1',
    },
    testEnvironment: 'node',
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map
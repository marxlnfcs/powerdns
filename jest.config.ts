export default {
    clearMocks: true,
    //collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    preset: 'ts-jest',
    testEnvironment: "node",
    collectCoverageFrom: [
        "src/lib/client/**/*.ts"
    ]
};

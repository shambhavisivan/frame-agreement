module.exports = {
	verbose: true,
	roots: ['<rootDir>'],
	transform: {
		'^.+\\.(ts|tsx)?$': 'ts-jest'
	},
	setupFiles: ['<rootDir>/src/local-server/local_data.js'],
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: -10
		}
	}
};

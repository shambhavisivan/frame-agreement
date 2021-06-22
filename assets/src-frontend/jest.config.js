module.exports = {
	verbose: true,
	roots: ['<rootDir>'],
	transform: {
		'^.+\\.(ts|tsx)?$': 'ts-jest'
	},
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', './test-setup.js'],
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	globals:{
		// this dependency is added to support cs-ui-components usage in tests
		crypto :{
			getRandomValues: (arr) => require("crypto").randomBytes(arr.length),
		}
	}
};

module.exports = {
	verbose: true,
	roots: ['<rootDir>'],
	transform: {
		'^.+\\.(ts|tsx)?$': 'ts-jest'
	},
	setupFiles: ['<rootDir>/src/local-server/local_data.js'],
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};


module.exports = {
	verbose: true,
	roots: ['<rootDir>'],
	transform: {
		'^.+\\.(ts|tsx)?$': 'ts-jest'
	},
	setupFiles: [],
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};

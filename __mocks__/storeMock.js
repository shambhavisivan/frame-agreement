jest.mock('api', () => ({
  __esModule: true,
  default: () => 'Blah',
  publish: () async (a) => a
  subscribe: async (a) => a
}));
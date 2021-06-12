import description from './package.json';

export default [
	{
    input: 'index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'default'
    },
    external: [ ...Object.keys(description.dependencies), 'events' ]
  },
  {
    input: 'index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      esModule: true,
      exports: 'named'
    },
    external: [ ...Object.keys(description.dependencies), 'events' ]
  }
];

import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/index.ts',
  output: [
    {
      file: 'dist/bundle.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/bundle.mjs',
      format: 'esm',
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        incremental: false,
      },
    }),
  ],
};

import typescript from 'rollup-plugin-typescript2'

export default {
  input: './packages/cli/src/index.ts',
  output: [
    {
      file: 'packages/cli/bin/cli.js',
      format: 'esm',
    },
  ],
  plugins: [typescript()],
}

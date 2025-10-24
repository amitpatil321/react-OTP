import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import postcss from "rollup-plugin-postcss"

const packageJson = require("./package.json")

export default [
  {
    input: "src/index.ts",
    // output: [
    // {
    //   file: packageJson.main,
    //   format: "cjs",
    //   sourcemap: true
    // },
    // {
    //   file: packageJson.module,
    //   format: "esm",
    //   sourcemap: true
    // }
    // ],
    output: {
      file: "dist/index.js",
      format: "esm",
      sourcemap: true
    },
    plugins: [
      peerDepsExternal(),
      // extract CSS into a single `index.css` file at the package root
      // so consumers (and SSR) can import it directly: `react-smart-otp/dist/index.css`.
      postcss({ extract: "index.css", minimize: true, sourceMap: true }),
      resolve(),
      commonjs(),
      // Use a rollup-specific tsconfig that does NOT emit declarations. The
      // `rollup-plugin-dts` step below will emit a single bundled .d.ts file.
      typescript({ tsconfig: "./tsconfig.rollup.json" }),
      terser()
    ],
    external: ["react", "react-dom"]
  },
  {
    input: "src/index.ts",
    // emit a single declaration file that matches package.json's `types` field
    output: [{ file: "dist/index.d.ts", format: "es" }],
    // The dts plugin will walk imports; ensure CSS imports don't cause parse errors
    // by providing the same tiny CSS handler used for the JS build.
    plugins: [
      {
        name: "css-empty-module",
        transform(code, id) {
          if (id && id.endsWith(".css")) {
            return {
              code: 'export default "";',
              map: { mappings: "" }
            }
          }
          return null
        }
      },
      dts.default()
    ]
  }
]

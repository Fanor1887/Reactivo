import path from 'path';
import { fileURLToPath } from 'url';
import TerserPlugin from 'terser-webpack-plugin';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            reserved: ['renderers', 'initComponents'], // Protege estas variables
          },
          compress: {
            drop_console: true, // Elimina console.log
            drop_debugger: true, // Elimina debugger
            pure_funcs: ['console.info'], // Elimina console.info
          },
          format: {
            comments: false, // ¡Ningún comentario en producción!
          },
        },
        extractComments: false, // No genera archivo .LICENSE.txt
      }),
    ],
  },
  mode: 'production',
};

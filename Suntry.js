class Suntry {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('Suntry', (compilation, callback) => {
      Object.keys(compilation.assets).forEach((assetName) => {
        if (assetName.endsWith('.js')) {
          let source = compilation.assets[assetName].source();
          const { catchFunction = () => {} } = this.options;

          source = `
            (function() {
              const customCatchFunction = ${catchFunction.toString()};
              try {
                ${source}
              } catch (error) {
                customCatchFunction(error);
              }
            })();
          `;

          compilation.assets[assetName] = {
            source: () => source,
            size: () => source.length
          };
        }
      });
      callback();
    });
  }
}

module.exports = Suntry;

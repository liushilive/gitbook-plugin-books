var katex = require("katex");
var path = require('path');

function getAssets() {
  var cssFile = 'katex/dist/katex.min.css';
  var cssNames = [];

  var cssPath = require.resolve(cssFile);
  var cssFolder = path.dirname(cssPath);
  var cssName = path.basename(cssPath);
  cssNames.push(cssName);

  return {
    assets: cssFolder,
    css: cssNames
  };
}

module.exports = {
  book: getAssets,
  ebook: getAssets,
  blocks: {
    math: {
      shortcuts: {
        parsers: ["markdown", "asciidoc", "restructuredtext"],
        start: "$$",
        end: "$$"
      },
      process: function (blk) {
        var tex = blk.body;
        var isInline = (tex[0] == "\n");
        var output = katex.renderToString(tex, {
          displayMode: isInline
        });
        return output;
      }
    }
  }
};

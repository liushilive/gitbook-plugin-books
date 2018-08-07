const path = require('path');
try {
  var books = require("books-cli");
} catch (error) {
  console.warn(error);
}

function getConfig(context, type, defaultValue) {
  return context.config.get('pluginsConfig.books.' + type, defaultValue);
}

function getAssets() {
  var cssNames = [
    'splitter.css',
    'image-captions.css'
  ];
  var jsNames = [
    'splitter.js',
    "toggle.js"
  ];
  cssNames = cssNames.concat(books.Katex.cssNames);
  cssNames = cssNames.concat(getConfig(this, 'themes', books.Prism.cssNames));

  return {
    assets: './assets',
    css: cssNames,
    js: jsNames
  };
}

module.exports = {
  book: getAssets,

  // Map of hooks
  hooks: {
    init: function () {
      try {
        var outputDirectory = path.join(this.output.root(), '/gitbook/gitbook-plugin-books');

        books.Tools.copy_assets(books.Katex.assets, outputDirectory);
        books.Tools.copy_assets(books.Prism.assets, outputDirectory);

        return books.ImageCaptions.onInit(this);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    page: function (page) {
      try {
        page = books.ImageCaptions.onPage(this, page);
        page = books.Prism.hooks_page(page);
        return page;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    'page:before': function (page) {
      page = books.Mermaid.processMermaidBlockList(page);
      return page;
    }
  },

  // Map of new blocks
  blocks: {
    math: {
      shortcuts: books.Katex.shortcuts,
      process: books.Katex.process
    },
    mermaid: {
      process: function (block) {
        var body = block.body;
        return books.Mermaid.string2svgAsync(body);
      }
    },
    code: function (block) {
      var body = block.body;
      var lang = block.kwargs.language.toLowerCase();
      return books.Prism.code_highlighted(body, lang);
    }
  },

  // Map of new filters
  filters: {}
};

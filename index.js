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
        'bootstrap.min.css',
        'stype.min.css',
        'lightbox.min.css'
    ];
    var jsNames = [
        'jquery.mark.js',
        'bootstrap.min.js',
        'main.min.js',
        'lightbox.min.js'
    ];
    cssNames = cssNames.concat(books.Katex.cssNames);
    cssNames = cssNames.concat(getConfig(this, 'prism_themes', books.Prism.cssNames));

    return {
        assets: './assets',
        css: cssNames,
        js: jsNames
    };
}

module.exports = {
    // book: getAssets,
    website: getAssets,

    // Map of hooks
    hooks: {
        init: function () {
            // 1
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
            // 4
            try {
                page = books.ImageCaptions.onPage(this, page);
                page = books.Prism.hooks_page(page);
                page = books.page_footer_copyright(this, page);
                page = books.search_plus.hooks_page(this, page);
                page = books.anchor_navigation_ex.hooks_page(page);
                page = books.sectionx.hooks_page(page);
                return page;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        'page:before': function (page) {
            // 2
            try {
                page = books.file_imports.process(page);
                page = books.Mermaid.processMermaidBlockList(page);
                return page;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        'finish': function () {
            try {
                return books.search_plus.hooks_finish(this);
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    },

    // Map of new blocks
    blocks: {
        // 3
        math: {
            shortcuts: books.Katex.shortcuts,
            process: books.Katex.process
        },
        mermaid: {
            process: function (block) {
                try {
                    var body = block.body;
                    return books.Mermaid.string2svgAsync(body);
                } catch (error) {
                    console.error(error);
                    throw error;
                }
            }
        },
        code: function (block) {
            try {
                var body = block.body;
                var lang = block.kwargs.language;
                return books.Prism.code_highlighted(body, lang);
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        s: {
            process: function (block) {
                return '<span class="spoiler">' + block.body + '</span>';
            }
        }
    },

    // Map of new filters
    filters: {}
};
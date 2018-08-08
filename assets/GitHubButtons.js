require(['gitbook'], function (gitbook) {
  gitbook.events.bind('start', function (e, config) {
    var githubURL = config.books && config.books.url ? config.books.url : null;
    if (githubURL) {
      gitbook.toolbar.createButton({
        icon: 'fa fa-github',
        label: 'GitHub',
        position: 'right',
        onClick: function () {
          window.open(githubURL);
        }
      });
    }
  });
});
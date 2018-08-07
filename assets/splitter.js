require(['gitbook', 'jQuery'], function (gitbook, $) {
  if ($(window).width() <= 600) {
    return;
  }

  gitbook.events.bind('start', function () {
  });

  gitbook.events.bind('page.change', function () {
    var KEY_SPLIT_STATE = 'gitbook_split';

    var isDraggable = false;
    var splitState = null;
    var grabPointWidth = null;

    var $body = $('body');
    var $book = $('.book');
    var $summary = $('.book-summary');
    var $bookBody = $('.book-body');
    var $divider = $('<div class="divider-content-summary">' +
      '<div class="divider-content-summary__icon">' +
      '<i class="fa fa-ellipsis-v"></i>' +
      '</div>' +
      '</div>');

    $summary.append($divider);

    // restore split state from sessionStorage
    splitState = getSplitState();
    setSplitState(
      splitState.summaryWidth,
      splitState.summaryOffset,
      splitState.bookBodyOffset
    );

    setTimeout(function () {
      var isGreaterThanEqualGitbookV2_5 = !Boolean($('.toggle-summary').length);

      var $toggleSummary = isGreaterThanEqualGitbookV2_5
        ? $('.fa.fa-align-justify').parent() : $('.toggle-summary');

      $toggleSummary.on('click', function () {

        var summaryOffset = null;
        var bookBodyOffset = null;

        var isOpen = isGreaterThanEqualGitbookV2_5
          ? !gitbook.sidebar.isOpen() : $book.hasClass('with-summary');

        if (isOpen) {
          summaryOffset = -($summary.outerWidth());
          bookBodyOffset = 0;
        } else {
          summaryOffset = 0;
          bookBodyOffset = $summary.outerWidth();
        }

        setSplitState($summary.outerWidth(), summaryOffset, bookBodyOffset);
        saveSplitState($summary.outerWidth(), summaryOffset, bookBodyOffset);
      });
    }, 1);

    $divider.on('mousedown', function (event) {
      event.stopPropagation();
      isDraggable = true;
      grabPointWidth = $summary.outerWidth() - event.pageX;
    });

    $body.on('mouseup', function (event) {
      event.stopPropagation();
      isDraggable = false;
      saveSplitState(
        $summary.outerWidth(),
        $summary.position().left,
        $bookBody.position().left
      );
    });

    $body.on('mousemove', function (event) {
      if (!isDraggable) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      $summary.outerWidth(event.pageX + grabPointWidth);
      $bookBody.offset({ left: event.pageX + grabPointWidth });
    });

    function getSplitState() {
      var splitState = JSON.parse(sessionStorage.getItem(KEY_SPLIT_STATE));
      splitState || (splitState = {});
      splitState.summaryWidth || (splitState.summaryWidth = $summary.outerWidth());
      splitState.summaryOffset || (splitState.summaryOffset = $summary.position().left);
      splitState.bookBodyOffset || (splitState.bookBodyOffset = $bookBody.position().left);
      return splitState;
    }

    function saveSplitState(summaryWidth, summaryWidthOffset, bookBodyOffset) {
      sessionStorage.setItem(KEY_SPLIT_STATE, JSON.stringify({
        summaryWidth: summaryWidth,
        summaryOffset: summaryWidthOffset,
        bookBodyOffset: bookBodyOffset,
      }));
    }

    function setSplitState(summaryWidth, summaryOffset, bookBodyOffset) {
      $summary.outerWidth(summaryWidth);
      $summary.offset({ left: summaryOffset });
      $bookBody.offset({ left: bookBodyOffset });
      $summary.css({ position: 'absolute' });
      $bookBody.css({ position: 'absolute' });
    }
  });
});
function callTwitterJS() {
  // すでに window.twttr オブジェクトが存在する場合は、
  // 新しく script タグを追加せず、既存の twttr.widgets.load() を使用する
  if (window.twttr && window.twttr.widgets && window.twttr.widgets.load) {
      window.twttr.widgets.load();
      return;
  }

  // widgets.js を読み込むための script タグを追加
  var js, fjs = document.getElementsByTagName('script')[0];
  js = document.createElement('script');
  js.id = 'twitter-wjs';
  js.src = 'https://platform.twitter.com/widgets.js';
  fjs.parentNode.insertBefore(js, fjs);

  // twttr オブジェクトを初期化
  window.twttr = window.twttr || {
      _e: [],
      ready: function(f) {
          this._e.push(f);
      }
  };
}

document.addEventListener('DOMContentLoaded', function() {
  callTwitterJS();

  var links = document.querySelectorAll('a[href^="https://x.com"]');
  for (var i = 0; i < links.length; i++) {
      var link = links[i];

      // /status/ を含むURLのみを対象とする
      if (link.href.includes('/status/')) {
          var blockquote = document.createElement('blockquote');
          blockquote.className = 'twitter-tweet';
          var a = document.createElement('a');
          a.href = link.href;
          blockquote.appendChild(a);
          link.parentNode.replaceChild(blockquote, link);
      }
  }

  // widgets.js の読み込み完了後に twttr.widgets.load() を実行
  window.twttr.ready(function(twttr) {
      twttr.widgets.load();
  });
});


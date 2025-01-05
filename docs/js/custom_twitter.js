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
          // 新しい p 要素を作成
          var p = document.createElement('p');

          // blockquote 要素を作成
          var blockquote = document.createElement('blockquote');
          blockquote.className = 'twitter-tweet';

          // 新しい a 要素を blockquote のために作成
          var blockquoteLink = document.createElement('a');
          blockquoteLink.href = link.href;
          blockquote.appendChild(blockquoteLink);
          
          // 元のリンクを p 要素でラップ
          link.parentNode.insertBefore(p, link);
          p.appendChild(link);

          // p 要素の直後に blockquote を挿入
          p.parentNode.insertBefore(blockquote, p.nextSibling);
      }
  }

  // widgets.js の読み込み完了後に twttr.widgets.load() を実行
  window.twttr.ready(function(twttr) {
      twttr.widgets.load();
  });
});
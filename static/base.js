window.onload = () => {
  addJq(() => {
    addBackstretch(() => $.backstretch('https://i.loli.net/2020/01/20/VXvo2ShyBaPNkdJ.jpg'))
    setFavicon('https://i.loli.net/2019/07/09/5d2484e68fddd81209.jpg')
    setTableClass()
  })
}

function setFavicon(url) {
  $("link[rel*='icon']").attr("href", url)
}

function setTableClass() {
  $('table').each(function (i, n) {
    $(n).addClass('table b-table table-striped table-hover table-responsive')
  })
}

let a_idx = 0

function clickBomb() {
  $("body").click(function (e) {
    // var a = new Array('苟', '利', '国', '家', '生', '死', '以', '岂', '因', '福', '祸', '避', '趋', '之');
    var a = new Array('🕯');
    var $i = $("<span/>").text(a[a_idx]);
    a_idx = (a_idx + 1) % a.length;
    var x = e.pageX, y = e.pageY;
    $i.css({
      "z-index": 9999,
      "top": y - 20,
      "left": x,
      "position": "absolute",
      "font-weight": "bold",
      "color": "#ff6651"
    });
    $("body").append($i);
    $i.animate({"top": y - 180, "opacity": 0}, 1500, () => {
      $i.remove();
    });
  });
}

function addBackstretch(callback) {
  addScript('https://cdn.bootcss.com/jquery-backstretch/2.0.4/jquery.backstretch.min.js', callback)
}

function addJq(callback) {
  addScript('https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js', callback)
}

function addScript(url, callback) {
  let script = document.createElement('script')
  if (script.readyState) { //IE
    script.onreadystatechange = () => {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null
        callback()
      }
    }
  } else { //其他浏览器
    script.onload = callback
  }
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script)
}
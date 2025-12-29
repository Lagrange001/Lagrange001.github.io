(function () {
  // 在这里输入你想随机显示的句子
  var sayings = [
    "人生如逆旅，我亦是行人",
    "天行健，君子以自强不息",
    "保持热爱，奔赴山海",
    "每一个不曾起舞的日子，都是对生命的辜负"
  ];

  // 随机挑选一个
  var randomSaying = sayings[Math.floor(Math.random() * sayings.length)];

  function setSlogan() {
    // Fluid 主题首页副标题的 ID 通常是 subtitle
    var sub = document.getElementById('subtitle');
    if (sub) {
      sub.innerHTML = randomSaying;
    } else {
      // 如果还没加载出来，等 100 毫秒再试
      setTimeout(setSlogan, 100);
    }
  }

  setSlogan();
})();
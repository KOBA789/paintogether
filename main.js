$(document).ready(function () {
  socket = new io.Socket();
  socket.connect();
  var canvas = document.getElementById('canvas');
  if (!canvas || !canvas.getContext) return false;
  var ctx = canvas.getContext('2d');
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  var flg = false;
  var oldX, oldY;
  var draw = function (x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  }
  var send = function (x1, y1, x2, y2) {
    socket.send(JSON.stringify([x1, y1, x2, y2]));
  }
  var clear = function () {
    socket.send('cls');
  }
  $('#clearBtn').click(function () {
    ctx.clearRect(0, 0, 640, 480);
    clear();
  });
  $('#canvas').mousedown(function (e) {
    flg = true;
    oldX = e.pageX - $('#canvas').position().left;
    oldY = e.pageY - $('#canvas').position().top;
  });
  $('#canvas').mouseup(function (e) {
    flg = false;
  });
  $('#canvas').mousemove(function (e) {
    if (!flg) return;
    var x = e.pageX - $('#canvas').position().left;
    var y = e.pageY - $('#canvas').position().top;
    draw(oldX, oldY, x, y);
    send(oldX, oldY, x, y);
    oldX = x;
    oldY = y;
  });
  socket.on('message', function(data){
    console.log(data);
    if (data == 'cls') {
      ctx.clearRect(0, 0, 640, 480);
    } else {
      var pos = JSON.parse(data);
      draw(pos[0], pos[1], pos[2], pos[3]);
    }
  });
});

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let wx = 0; let wy = 0; let zoom = 3; let res = 1;


async function drawPoint(x, y, res, color) {
  context.fillStyle = "rgb(" + color * 2.55 + "," + color * 2.55 + "," + color * 2.55 + ")";
  context.fillRect(x, y, res, res);
}


async function draw() {
  if (res <= 0) res = 1;

  for (let x = 0; x < canvas.width / res; x++) {
    for (let y = 0; y < canvas.height / res; y++) {
      let a = (x + (wx / res / zoom) - (canvas.width / 2) / res) / (canvas.width / zoom / res / 1.777);
      let b = (y + (wy / res / zoom) - (canvas.height / 2) / res) / (canvas.height / zoom / res);

      let c = new ComplexNumber(a, b);
      let z = new ComplexNumber(0, 0);

      let iter = 0;

      while (iter < 100) {
        iter += 1;

        z.sqr();
        z.add(c);

        if (z.magn() > 2) break;
      }

      drawPoint(x * res, y * res, res, iter);
    }
  }
}


class ComplexNumber {
  constructor(a, b) { this.a = a; this.b = b; }

  sqr() {
    let tmp = (this.a * this.a) - (this.b * this.b);
    this.b = 2 * this.a * this.b; this.a = tmp;
  }

  magn() { return Math.sqrt((this.a * this.a) + (this.b * this.b)); }

  add(c) { this.a += c.a; this.b += c.b; }
}


function find() {
  wx = parseFloat(document.getElementById('wx').value); if(!wx) wx = 0;
  wy = parseFloat(document.getElementById('wy').value); if(!wy) wy = 0;
  zoom = document.getElementById('zoom').value; if(!zoom) zoom = 3;
  res = document.getElementById('res').value; if(!res) res = 1;
  draw();
}


// Controls
let mouseDown = false;
let lastWX = 0; let lastWY = 0;
let lastClientX = 0; let lastClientY = 0;
let pastRes = 0;


window.addEventListener("wheel", event => Zoom(event.deltaY));

canvas.addEventListener("mousemove", event => MouseMove(event.clientX, event.clientY));
canvas.addEventListener("mousedown", event => MouseDown(event.clientX, event.clientY));
canvas.addEventListener("mouseup", () => { mouseDown = false; res = pastRes; draw(); });


canvas.addEventListener("touchmove", event => MouseMove(event.touches[0].clientX, event.touches[0].clientY));
canvas.addEventListener("touchstart", event => MouseDown(event.touches[0].clientX, event.touches[0].clientY));
canvas.addEventListener("touchend", () => { mouseDown = false; res = pastRes; draw(); });

function MouseDown(x , y) {
  pastRes = res; res = 3;
  lastWX = wx; lastClientX = x;
  lastWY = wy; lastClientY = y;
  mouseDown = true;
}

function MouseMove(x , y) {
  if(!mouseDown) return;
  wx = lastWX + (lastClientX - x) * (zoom / 3); document.getElementById('wx').value = wx;
  wy = lastWY + (lastClientY - y) * (zoom / 3); document.getElementById('wy').value = wy;
  draw();
}

function Zoom(delta) {
  delta < 0 ? zoom /= 2 : zoom *= 2;
  document.getElementById('zoom').value = zoom;
  draw();
}
// Controls


draw();
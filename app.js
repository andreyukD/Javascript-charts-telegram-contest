function lerp(start, end, t) {
    return start + t * (end-start);
}

function lerp_point(p0, p1, t) {
    return new Point(lerp(p0.x, p1.x, t),
                     lerp(p0.y, p1.y, t));
}

//my
function Point(x,y) {
	this.x = x;
	this.y = y;
}

function diagonal_distance(p0, p1) {
    var dx = p1.x - p0.x, dy = p1.y - p0.y;
    return Math.max(Math.abs(dx), Math.abs(dy));
}

function round_point(p) {
	return new Point(p.x, p.y);
    //return new Point(Math.round(p.x), Math.round(p.y));
}

function line(p0, p1) {
    var points = [];
    var N = diagonal_distance(p0, p1);
    for (var step = 0; step <= N; step++) {
        var t = N == 0? 0.0 : step / N;
        points.push(round_point(lerp_point(p0, p1, t)));
    }
    return points;
}


//my
var p0 = {
	x: 1,
	y: 1
}

var p1 = {
	x: 4,
	y: 6
}

var p2 = {
	x: 8,
	y: 6
}

console.log(line(p0,p1));
console.log(line(p1,p2));



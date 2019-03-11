function lerp(start, end, t) {
    return start + t * (end-start);
}

function lerp_point(p0, p1, t) {
    return new Point(lerp(p0.x, p1.x, t),
                     lerp(p0.y, p1.y, t));
}

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


var chart = JSON.parse(chart);

var chartLength = chart[0].columns[0].length - 1;

var arrayY0 = chart[0].columns[1];
arrayY0.shift();

var chartMaxY0 = Math.max.apply(null, chart[0].columns[1]);

var arrPoints = [];
for(var i = 0; i < chartLength; i++) {
	arrPoints.push(new Point(i, arrayY0[i]));
}

var DOM = {
	bigBar: '.bigBar',
	smallBar: '.smallBar',
	yn_dot: 'simpleY',
	lineLERP: 'line',
}


function getCurrentYProportion(currentY, max) {
	return currentY * 100 / max;
}

function renderChart(el, x_start, x_end) {
	x_start = typeof x_start !== 'undefined' ? x_start : 0;
	x_end = typeof x_end !== 'undefined' ? x_end : chartLength;
	
	for(var i = x_start; i < x_end; i++) {
		document.querySelector(el).insertAdjacentHTML('beforeend', '<span data-id="'+i+'"><i class="'+DOM.yn_dot+'" style="bottom:'+getCurrentYProportion(arrayY0[i], chartMaxY0)+'%;"></i></span>');
		
		if(i !== x_end - 1) {
			var points = line(arrPoints[i], arrPoints[i+1]);
			for(var j = 0;j<points.length;j++) {
				document.querySelector(el + ' span[data-id="'+i+'"]').insertAdjacentHTML('beforeend', '<i class="'+DOM.lineLERP+'" style="bottom:'+getCurrentYProportion(points[j].y, chartMaxY0)+'%;left:'+((points[j].x - i) * 100 )+'%;"></i>');
			}				
		}
	}

}

renderChart(DOM.bigBar, 0, chartLength);
renderChart(DOM.smallBar, 0, chartLength);
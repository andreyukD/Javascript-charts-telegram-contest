//https://www.redblobgames.com/grids/line-drawing.html
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

//https://stackoverflow.com/questions/10564441/how-to-find-the-max-min-of-a-nested-array-in-javascript
function arrmax(arrs) {
    if (!arrs || !arrs.length) return undefined;
    var max = Math.max.apply(window, arrs[0]), m,
        f = function(v){ return !isNaN(v); };
    for (var i = 1, l = arrs.length; i<l; i++) {
        if ((m = Math.max.apply(window, arrs[i].filter(f)))>max) max=m;
    }
    return max;
}

function getTypeByLabel(label, numberData) {
	return chart[numberData].types[label];
}

function getNameByLabel(label, numberData) {
	return chart[numberData].names[label];
}

function getColorByLabel(label, numberData) {
	return chart[numberData].colors[label];
}

function getYLabels(numberData) {
	var arrLabels = [];
	for (var i = 1; i <= numberOfChartsY; i++) {
		arrLabels.push(chart[numberData].columns[i][0]);
	}
	return arrLabels;
}

function generateAllDotsY(numberData) {
	var yDataArr = [];
	
	for (var i = 1; i <= numberOfChartsY; i++) {//y0 starts with 1, y1 with 2...
		
		yDataArr[i - 1] = chart[numberData].columns[i];
		yDataArr[i - 1].shift();
	}
	return yDataArr;
}

function createCheckboxes(numberOfChartsY, numberData) {
	for(var i = 0; i<numberOfChartsY; i++) {
		var string='<label class="'+DOM.checkboxLineY+'"><input data-number-checkbox="'+i+'" type="checkbox" checked>'+getNameByLabel(arrLabels[i], numberData)+'</label>';
		document.querySelector(DOM.checkboxWrap).insertAdjacentHTML('beforeend', string);
	}
}

function getCurrentYProportion(currentY, max) {
	return currentY * 100 / max;
}

function renderChart(el, x_start, x_end, max) {
	x_start = typeof x_start !== 'undefined' ? x_start : 0;
	x_end = typeof x_end !== 'undefined' ? x_end : chartLength;
	

	for(var k = 0; k < numberOfChartsY; k++) {
	
		var div = document.createElement('div');
		div.className = 'y y'+k;
		document.querySelector(el).appendChild(div);
	
		for(var i = x_start; i < x_end; i++) {
			document.querySelector(el+ ' .y'+k).insertAdjacentHTML('beforeend', '<span data-id="'+i+'"><i class="'+DOM.yn_dot+'" style="bottom:'+getCurrentYProportion(yDataArr[k][i], max)+'%;"></i></span>');
			
			
			if(i !== x_end - 1) {
            
				var points = line(arrAllPoints[k][i], arrAllPoints[k][i+1]);
				for(var j = 0;j<points.length;j++) {
					document.querySelector(el+ ' .y'+k + ' span[data-id="'+i+'"]').insertAdjacentHTML('beforeend', '<i class="'+DOM.lineLERP+'" style="bottom:'+getCurrentYProportion(points[j].y, max)+'%;left:'+((points[j].x - i) * 100 )+'%;"></i>');
				}
				
			}
		}
	}
}

function generateAllPoints(numberOfChartsY, chartLength, yDataArr) {
	var arrAllPoints = [];
	var arrPoints = [];

	for(var k = 0; k < numberOfChartsY; k++) {
		for(var i = 0; i < chartLength; i++) {
			arrPoints.push(new Point(i, yDataArr[k][i]));
		}
		arrAllPoints[k] = arrPoints;
		arrPoints = [];
	}
	return arrAllPoints;
}

function generateCSS(sheet, arrLabels, numberOfChartsY, numberData) {
	for(var k = 0; k < numberOfChartsY; k++) {
		var selector = arrLabels[k];
		
		var strDotsY = '.'+selector + ' ' + '.'+DOM.yn_dot+' {background:'+getColorByLabel(selector,numberData)+' !important;}';
		var strLines = '.'+selector + ' ' + '.'+DOM.lineLERP+' {background:'+getColorByLabel(selector,numberData)+' !important;}';
		
		sheet.insertRule(strDotsY, 0);
		sheet.insertRule(strLines, 0);
	}
}

var sheet = (function() {
	var style = document.createElement("style");
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
	return style.sheet;
})();

//
function getActiveChecked() {
	var getAllChecked = [];
	checkboxesArr.forEach(function(a) {
		getAllChecked.push(a.checked);
	});
	return getAllChecked;	
}
//
function hideUncheked(i) {		
		var sel = 'y'+i.getAttribute('data-number-checkbox');
		
		var twoLines = document.querySelectorAll('.'+sel);
		var twoLinessArr = [].slice.call(twoLines);

		twoLinessArr.forEach(function(i) {
			i.classList.toggle('hide');
		});	
}

function setEventListeners(ch) {
	ch.forEach(function(i) {
	i.addEventListener('change', function(e) {
		//render only lines with checked
		//console.log(getActiveChecked());
		
		hideUncheked(i);
	});
	
});
}
//////////////////////////////////////////////////////////////////////////////////////
var numberData = 0;
var chart = JSON.parse(chart);
var chartLength = chart[numberData].columns[0].length - 1;//10
var numberOfChartsY = chart[numberData].columns.length - 1;//2
var DOM = {
	bigBar: '.bigBar',
	smallBar: '.smallBar',
	yn_dot: 'simpleY',
	lineLERP: 'line',
	checkboxLineY: 'checkboxLineY',
	checkboxWrap: '.checkBoxWrap'
}
var arrLabels = getYLabels(numberData);
var yDataArr = generateAllDotsY(numberData);
var arrAllPoints = generateAllPoints(numberOfChartsY, chartLength, yDataArr);
generateCSS(sheet, arrLabels, numberOfChartsY, numberData);
//
createCheckboxes(numberOfChartsY, numberData);
var checkboxes = document.querySelectorAll('.'+DOM.checkboxLineY+ ' input');
var checkboxesArr = [].slice.call(checkboxes);
setEventListeners(checkboxesArr);
//
var chartMaxY = arrmax(yDataArr);


///
renderChart(DOM.bigBar, 0, chartLength, chartMaxY);
renderChart(DOM.smallBar, 0, chartLength, chartMaxY);
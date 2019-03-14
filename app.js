function hypot(x, y){ return Math.sqrt(x*x + y*y) }

//https://gist.github.com/ManadayM/64d65825da97ffd994b4
function prettyDate(epoch, dateFormat){
	//TODO: add args validations here in future..
	var shortMonths = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
	var longMonths  = 'January_Febrary_March_April_May_June_July_August_September_Octeber_November_December'.split('_');
	
	var shortDays = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
	var longDays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
	
	var _df 	= dateFormat;
	
	// convert epoch date to date object
	var 	dt 	= new Date(epoch * 1000);
	
	var	date	= dt.getDate(),
		month	= dt.getMonth(),
		year	= dt.getFullYear(),
		day 	= dt.getDay(),
		
		hour	= dt.getHours(),
		mins	= dt.getMinutes(),
		secs	= dt.getSeconds();
	
	// year
	if (_df && _df.indexOf('yyyy') != -1) {
		_df = _df.replace('yyyy', year);
	}
	
	// day of week in long format e.g. Monday
	if (_df && _df.indexOf('DDDD') != -1) {
		_df = _df.replace('DDDD', longDays[day]);
	}
	
	// day of week in short format e.g. Mon
	if (_df && _df.indexOf('DDD') != -1) {
		_df = _df.replace('DDD', shortDays[day]);
	}
	
	// date of the month
	if (_df && _df.indexOf('dd') != -1) {
		_df = _df.replace('dd', date < 10 ? ('0' + date) : date);
	}
	
	// Month of the year in long format e.g. January
	if (_df && _df.indexOf('MMMM') != -1) {
		_df = _df.replace('MMMM', longMonths[month]);
	}
	
	// Month of the year in short format e.g. Jan
	if (_df && _df.indexOf('MMM') != -1) {
		_df = _df.replace('MMM', shortMonths[month]);
	}
	
	// Month of the year in numeric format e.g. 01
	if (_df && _df.indexOf('MM') != -1) {
		_df = _df.replace('MM', (month + 1) < 10 ? ('0' + (month + 1)) : (month + 1));
	}
	
	// hours
	if (_df && _df.indexOf('hh') != -1) {
		_df = _df.replace('hh', hour < 10 ? ('0' + hour) : hour);
	}
	
	// minutes
	if (_df && _df.indexOf('mm') != -1) {
		_df = _df.replace('mm', mins < 10 ? ('0' + mins) : mins);
	}
	
	// seconds
	if (_df && _df.indexOf('ss') != -1) {
		_df = _df.replace('ss', secs < 10 ? ('0' + secs) : secs);
	}
	
	return _df;
}

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


function renderPart(el, x_start, x_end, max) {
	for(var k = 0; k < numberOfChartsY; k++) {
		document.querySelector(el+ ' .'+arrLabels[k]).innerHTML = '';
		
		var allSpanInY = '';
		for(var i = x_start; i < x_end; i++) {
			allSpanInY += '<span data-id="'+i+'"><i class="'+DOM.yn_dot+'" style="bottom:'+getCurrentYProportion(yDataArr[k][i], max)+'%;"></i><svg><line x1="0" y1="'+(100-getCurrentYProportion(yDataArr[k][i], max))+'%" x2="100%" y2="'+(100 - getCurrentYProportion(yDataArr[k][i+1], max))+'%" /></svg></span>';
		}
		document.querySelector(el+ ' .'+arrLabels[k]).insertAdjacentHTML('beforeend', allSpanInY);	
		//to delete
		//for(var i = x_start; i < x_end; i++) {
		//	if(i !== x_end - 1) {
		//		
		//	var points = line(arrAllPoints[k][i], arrAllPoints[k][i+1]);
		//	for(var j = 0;j<points.length;j++) {
		//	document.querySelector(el+ ' .'+arrLabels[k] + ' span[data-id="'+i+'"]').insertAdjacentHTML('beforeend', '<i class="'+DOM.lineLERP+'" style="bottom:'+getCurrentYProportion(points[j].y, max)+'%;left:'+((points[j].x - i) * 100 )+'%;"></i>');
		//	}
		//		
		//	}			
		//}
		//to delete
	}
}

function renderWrapperBar(el, x_start, x_end) {
	for(var k = 0; k < numberOfChartsY; k++) {
		var div = document.createElement('div');
		div.className = 'y ' + arrLabels[k];
		document.querySelector(el).appendChild(div);
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
		var strLines = '.'+selector + ' ' + 'svg line {stroke:'+getColorByLabel(selector,numberData)+' !important;}';
		
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
			hideUncheked(i);
			renderPart(DOM.bigBar, 0, chartLength, arrmax(getMax(0,chartLength,getActiveChecked())));
			generateVertGrid(state.getmax());
		});
	});
}
//
function getMax(x_start, x_end, whichActive) {
	var tempArrActiveY = [];
	for(var i = 0;i<whichActive.length;i++) {
		if(whichActive[i] == true) {
			tempArrActiveY.push(yDataArr[i].slice(x_start, x_end));
		}
	}
	return tempArrActiveY;
}

function generateVertGrid(max) {
	var roundMax = Math.ceil(max / 10) * 10
	var part = roundMax / 5;
	var str='';
	for(var i=0;i<5;i++) {
		str += '<span><i>'+(roundMax - part*i) +'</i></span>';
	}
	document.querySelector(DOM.vertGridWrap).innerHTML = '';
	document.querySelector(DOM.vertGridWrap).insertAdjacentHTML('beforeend',str);
}

function generateHorGrid(x_start, x_end) {
	var str='';
	for(var i=0;i<5;i++) {
		//todo - only 5 between dates
		var g = prettyDate(arrDates[x_start], 'dd MMM');
		str += '<span><i>'+g+'</i></span>';
		x_start++;
	}
	document.querySelector(DOM.horGridWrap).innerHTML = '';
	document.querySelector(DOM.horGridWrap).insertAdjacentHTML('beforeend',str);	
}
//////////////////////////////////////////////////////////////////////////////////////
var numberData = 3;
var chart = JSON.parse(chart);
var chartLength = chart[numberData].columns[0].length - 1;//10
var numberOfChartsY = chart[numberData].columns.length - 1;//2
var DOM = {
	bigBar: '.bigBar',
	smallBar: '.smallBar',
	yn_dot: 'simpleY',
	lineLERP: 'line',
	checkboxLineY: 'checkboxLineY',
	checkboxWrap: '.checkBoxWrap',
	vertGridWrap: '.vert',
	horGridWrap: '.hor',
}
var arrLabels = getYLabels(numberData);
var yDataArr = generateAllDotsY(numberData);
var arrDates = chart[numberData].columns[0];
arrDates.shift();
console.log(arrDates);
var arrAllPoints = generateAllPoints(numberOfChartsY, chartLength, yDataArr);
generateCSS(sheet, arrLabels, numberOfChartsY, numberData);
//
createCheckboxes(numberOfChartsY, numberData);
var checkboxes = document.querySelectorAll('.'+DOM.checkboxLineY+ ' input');
var checkboxesArr = [].slice.call(checkboxes);
setEventListeners(checkboxesArr);
//
//var chartMaxY = arrmax(yDataArr);
var chartMaxY = arrmax(getMax(0,chartLength,getActiveChecked()));
renderWrapperBar(DOM.bigBar, 0, chartLength);
renderWrapperBar(DOM.smallBar, 0, chartLength);
renderPart(DOM.smallBar, 0, chartLength, chartMaxY);
renderPart(DOM.bigBar, 0, chartLength, chartMaxY);
//
var State = function(cur_x_start, cur_x_end) {
	this.cur_x_start = cur_x_start;
	this.cur_x_end = cur_x_end;
	
	this.getmax = function() {
		return arrmax(getMax(cur_x_start,cur_x_end,getActiveChecked()));
	}
}

var state = new State(0, chartLength);
//console.log(state.getmax());
//
generateVertGrid(state.getmax());
generateHorGrid(state.cur_x_start, state.cur_x_end);

console.log(hypot(3,4));
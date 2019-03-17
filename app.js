//https://gist.github.com/ManadayM/64d65825da97ffd994b4
function prettyDate(epoch, dateFormat){
	//TODO: add args validations here in future..
	var shortMonths = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
	var longMonths  = 'January_Febrary_March_April_May_June_July_August_September_Octeber_November_December'.split('_');
	
	var shortDays = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
	var longDays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
	
	var _df 	= dateFormat;
	
	// convert epoch date to date object
	var dt 	= new Date(epoch);
	
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

function Point(x,y) {
	this.x = x;
	this.y = y;
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


function renderPart(el, x_start, x_end, max, renderAdditems) {
	
	if(renderAdditems) {
	
		var divHorWrap = document.createElement('div');
		divHorWrap.className = 'hor';	
		document.querySelector(el + ' .'+DOM.subInBar).appendChild(divHorWrap);
	
		//render X dates
		var allSpanX = '';
		for(var i = x_start; i < x_end - 1; i++) {
			var g = prettyDate(arrDates[i], 'MMM dd');
			//var g = arrDates[i];
			allSpanX += '<span><i>'+g+'</i></span>';
		}
		document.querySelector(el + ' '+DOM.horGridWrap).innerHTML = '';
		document.querySelector(el + ' '+DOM.horGridWrap).insertAdjacentHTML('beforeend',allSpanX);	
		//render X dates
	}
	
	
	for(var k = 0; k < numberOfChartsY; k++) {
		document.querySelector(el+ ' .'+arrLabels[k]).innerHTML = '';
		
		var allSpanInY = '';
		for(var i = x_start; i < x_end - 1; i++) {
			
			allSpanInY += '<span data-id="'+i+'"><i class="'+DOM.yn_dot+'" style="bottom:'+getCurrentYProportion(yDataArr[k][i], max)+'%;"></i><svg><line x1="0" y1="'+(100-getCurrentYProportion(yDataArr[k][i], max))+'%" x2="100%" y2="'+(100 - getCurrentYProportion(yDataArr[k][i+1], max))+'%" /></svg></span>';
		}
		document.querySelector(el+ ' .'+arrLabels[k]).insertAdjacentHTML('beforeend', allSpanInY);
	}
}

function renderWrapperBar(el, x_start, x_end) {
	var divSub = document.createElement('div');
	divSub.className = DOM.subInBar;	
	document.querySelector(el).appendChild(divSub);
	
	for(var k = 0; k < numberOfChartsY; k++) {
		var div = document.createElement('div');
		div.className = 'y ' + arrLabels[k];
		document.querySelector(el + ' .' + DOM.subInBar).appendChild(div);
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
			renderPart(DOM.bigBar, 0, chartLength, arrmax(getMax(0,chartLength,getActiveChecked())), true);
			renderPart(DOM.smallBar, 0, chartLength, arrmax(getMax(0,chartLength,getActiveChecked())), false);
			generateVertGrid(state.getmax());
		});
	});
	
	//
	
	var elSlidMove = document.querySelector(DOM.slider_chart);
	var elBigBar = document.querySelector(DOM.bigBar);
	
	var div = DOM.slider_chart;
	var element = document.querySelector(div);

	var resizerLeft = document.querySelector(div + ' .resizer.bottom-left');
	var resizerRight = document.querySelector(div + ' .resizer.bottom-right');

	var minimum_size = 100;
	var original_width = 0;
	var original_x = 0;
	var original_mouse_x = 0;
	
	var widthSlider, sliderAllWidth;
	var handler = moveSlider.bind(this);
	
	var coords, shiftX, shiftL, coordsL, coordsR, shiftR, helperForLeftBouning;


	document.querySelector(DOM.slider_chart).addEventListener('mousedown', function(e) {
		if(e.target.className !== 'resizer bottom-left' && e.target.className !== 'resizer bottom-right') {//чтобы не ездила когда я делаю ресайз
		
			coords = getCoords(elSlidMove);//чтобы высчитать сдвиг
			shiftX = e.pageX - coords.left;		
			
			updateInfoAboutSlider(widthSlider, sliderAllWidth);
			document.addEventListener('mousemove', handler);
			document.addEventListener('mouseup', stopMovingSlider);
		}
	});	
	
	
	resizerLeft.addEventListener('mousedown', function(e) {	
	
	
		coordsL = getCoords(elSlidMove);//чтобы высчитать сдвиг
		shiftL = e.pageX - coordsL.left;
		//console.log(shiftL);
			
	  helperInitResizers(e);
	  window.addEventListener('mousemove', resizeLeft);
	  window.addEventListener('mouseup', stopResizeLeft); 
	});

	resizerRight.addEventListener('mousedown', function(e) {
	
		coordsR = getCoords(document.querySelector('.resizer.bottom-right'));//чтобы высчитать сдвиг
		shiftR = e.pageX - coordsR.left;

	
	  helperInitResizers(e);
	  window.addEventListener('mousemove', resizeRight);
	  window.addEventListener('mouseup', stopResizeRight);  
	});		
	
	function changeSubWidth() {
		elBigBar.querySelector('.'+DOM.subInBar).style.width = (sliderAllWidth / widthSlider * 100) +"%";
	}
	
	function stopMovingSlider() {
		document.removeEventListener('mousemove', handler);		
	}
	
	function updateInfoAboutSlider() {
		widthSlider = elSlidMove.offsetWidth; //320
		sliderAllWidth = elBigBar.offsetWidth; //640 - any wrap element
		
	}
	
	//https://learn.javascript.ru/coordinates-document#getCoords
	function getCoords(elem) {
		var box = elem.getBoundingClientRect();

		return {
		top: box.top + pageYOffset,
		left: box.left + pageXOffset
		};
	}

	
	function moveSlider(e) {	
		changeSubWidth();
		
		//https://learn.javascript.ru/drag-and-drop
		
		var x = e.pageX - shiftX - elSlidMove.parentNode.offsetLeft;
		//console.log(`
		//	${e.pageX} - e.pageX
		//	${shiftX} - shiftX
		//	${elSlidMove.parentNode.offsetLeft} - elSlidMove.parentNode.offsetLeft
		//`);
		
		if(x <= 0) {x = 0;}
		else if(x >= sliderAllWidth - widthSlider) {x = sliderAllWidth - widthSlider;}
		//console.log(x);
		
		elSlidMove.style.left = x + 'px';
		elBigBar.scrollLeft = x * (elBigBar.scrollWidth / elBigBar.offsetWidth);
		
	}
	
//	
	function helperInitResizers(e) {
	 e.preventDefault()
      original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
      original_x = element.getBoundingClientRect().left;
      original_mouse_x = e.pageX;
	  helperForLeftBouningOldLeft = parseFloat(elSlidMove.style.left.replace('px', ''));
	}

	function resizeLeft(e) {
	updateInfoAboutSlider();
	changeSubWidth();
	
	if(e.pageX - shiftL - elSlidMove.parentNode.offsetLeft >= 0) {//after need to 

        var width = original_width - (e.pageX - original_mouse_x);
		
		
        if (width > minimum_size) {
          element.style.width = width + 'px';
		  
		  var leftSlidCur = helperForLeftBouningOldLeft + (e.pageX - original_mouse_x)
          element.style.left = leftSlidCur + 'px';
		  
		  elBigBar.scrollLeft = leftSlidCur * (elBigBar.scrollWidth / elBigBar.offsetWidth);
		  //у левого скролл перемещение похоже на драг

        }
		}//if>0
		
		
		//optional - auto bounds left
		else {
			//element.style.left = 0;
			//elBigBar.scrollLeft = 0;
		}
    }
	
	function resizeRight(e) {
	updateInfoAboutSlider();
	changeSubWidth();	

		//console.log(e.pageX - elSlidMove.parentNode.offsetLeft);
		if(e.pageX - elSlidMove.parentNode.offsetLeft + (resizerRight.offsetWidth - shiftR) <= sliderAllWidth) {
			//
			//var tempBound = e.pageX;
			//if(e.pageX < 0) {tempBound = 0;}
			
			var width = original_width + (e.pageX - original_mouse_x);
			
			if (width > minimum_size) {
			  element.style.width = width + 'px';
			  
			  elBigBar.scrollLeft = elSlidMove.offsetLeft * (elBigBar.scrollWidth / elBigBar.offsetWidth) + (elBigBar.scrollWidth / elBigBar.offsetWidth);
			  //у лева и права разные функции скролла перемещение - здесь получаем одступ от слайдера к углу и умножаем на пропорцию всего скролла на враппер. и добавляем пропорцию
			}
		}
		
		//optional - auto bounds right
		else {
			
		}
    }	
	
    function stopResizeLeft() {
      window.removeEventListener('mousemove', resizeLeft)
    }
	
    function stopResizeRight() {
      window.removeEventListener('mousemove', resizeRight)
    }	
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
		var hideFirst = i === 0 ? 'style="display:none;"' : '';
		str += '<span><i '+hideFirst+'>'+(roundMax - part*i) +'</i></span>';
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
var numberData = 1;
var chart = JSON.parse(chart);
var chartLength = chart[numberData].columns[0].length - 1;//10
var numberOfChartsY = chart[numberData].columns.length - 1;//2
var DOM = {
	bigBar: '.bigBar',
	smallBar: '.smallBar',
	yn_dot: 'simpleY',
	checkboxLineY: 'checkboxLineY',
	checkboxWrap: '.checkBoxWrap',
	vertGridWrap: '.vert',
	horGridWrap: '.hor',
	slider_chart: '.slider_chart',
	subInBar: 'sub',
}
var arrLabels = getYLabels(numberData);
var yDataArr = generateAllDotsY(numberData);
var arrDates = chart[numberData].columns[0];
arrDates.shift();
//console.log(arrDates);
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
renderPart(DOM.smallBar, 0, chartLength, chartMaxY, false);
renderPart(DOM.bigBar, 0, chartLength, chartMaxY, true);
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
//generateHorGrid(state.cur_x_start, state.cur_x_end);

//
function initScrolls() {
	widthSlider = document.querySelector(DOM.slider_chart).offsetWidth;
	sliderAllWidth = document.querySelector(DOM.bigBar).offsetWidth;
	document.querySelector(DOM.bigBar).querySelector('.'+DOM.subInBar).style.width = (sliderAllWidth / widthSlider * 100) +"%";
	document.querySelector(DOM.slider_chart).style.left = "0";
	document.querySelector(DOM.bigBar).scrollLeft = 0;
}
initScrolls();
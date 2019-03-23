function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;        
        case "touchend":   type = "mouseup";   break;
        default:           return;
    }

     //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
     //               screenX, screenY, clientX, clientY, ctrlKey, 
     //               altKey, shiftKey, metaKey, button, relatedTarget);

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    //event.preventDefault();
}

function mapTouchEvents() 
{
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);    
}

function nightfn() {
	var strNight='<div class="switch">Switch to Night mode</div>';
	document.querySelector('body').insertAdjacentHTML('beforeend', strNight);
	var night = false;
	document.querySelector('.switch').addEventListener('click', function(e) {
		document.querySelector('body').classList.toggle('night');
		if(!night) {this.innerHTML = 'Switch to Day mode'; night = true;}
		else {this.innerHTML = 'Switch to Night mode'; night = false;}
	});
}

function prettyDate(epoch, dateFormat){
	var shortMonths = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
	var longMonths  = 'January_Febrary_March_April_May_June_July_August_September_Octeber_November_December'.split('_');
	
	var shortDays = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
	var longDays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
	
	var _df 	= dateFormat;
	
	var dt 	= new Date(epoch);
	
	var	date	= dt.getDate(),
		month	= dt.getMonth(),
		year	= dt.getFullYear(),
		day 	= dt.getDay(),
		
		hour	= dt.getHours(),
		mins	= dt.getMinutes(),
		secs	= dt.getSeconds();
	
	if (_df && _df.indexOf('yyyy') != -1) {
		_df = _df.replace('yyyy', year);
	}
	
	if (_df && _df.indexOf('DDDD') != -1) {
		_df = _df.replace('DDDD', longDays[day]);
	}
	
	if (_df && _df.indexOf('DDD') != -1) {
		_df = _df.replace('DDD', shortDays[day]);
	}
	
	if (_df && _df.indexOf('dd') != -1) {
		_df = _df.replace('dd', date < 10 ? ('0' + date) : date);
	}
	
	if (_df && _df.indexOf('MMMM') != -1) {
		_df = _df.replace('MMMM', longMonths[month]);
	}
	
	if (_df && _df.indexOf('MMM') != -1) {
		_df = _df.replace('MMM', shortMonths[month]);
	}
	
	if (_df && _df.indexOf('MM') != -1) {
		_df = _df.replace('MM', (month + 1) < 10 ? ('0' + (month + 1)) : (month + 1));
	}
	
	return _df;
}

function Point(x,y) {
	this.x = x;
	this.y = y;
}

function arrmax(arrs) {
    if (!arrs || !arrs.length) return undefined;
    var max = Math.max.apply(window, arrs[0]), m,
	f = function(v){ return !isNaN(v); };
    for (var i = 1, l = arrs.length; i<l; i++) {
        if ((m = Math.max.apply(window, arrs[i].filter(f)))>max) max=m;
	}
    return max;
}

function kFormatter(num) {
     if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
     }
     if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
     }
     if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
     }
     return num;
}

function getTypeByLabel(label, numberData) {
	return chart[numberData].types[label];
}

function getNameByLabel(label, numberData, chart) {
	return chart[numberData].names[label];
}

function getColorByLabel(label, numberData, chart) {
	return chart[numberData].colors[label];
}

function getYLabels(numberData, numberOfChartsY, chart) {
	var arrLabels = [];
	for (var i = 1; i <= numberOfChartsY; i++) {
		arrLabels.push(chart[numberData].columns[i][0]);
	}
	return arrLabels;
}

function generateAllDotsY(numberData, numberOfChartsY, chart) {
	var yDataArr = [];
	
	for (var i = 1; i <= numberOfChartsY; i++) {//y0 starts with 1, y1 with 2...
		
		yDataArr[i - 1] = chart[numberData].columns[i];
		yDataArr[i - 1].shift();
	}
	return yDataArr;
}

function createCheckboxes(numberOfChartsY, numberData, chart, arrLabels, wrDomClass) {
	
	for(var i = 0; i<numberOfChartsY; i++) {
		var color = getColorByLabel(arrLabels[i], numberData, chart);
		var string='<label for="check_'+i+wrDomClass+'" class="'+DOM.checkboxLineY+'"><input id="check_'+i+wrDomClass+'" data-number-checkbox="'+i+'" type="checkbox" checked><span><i style="background:'+color+';border-color:'+color+';"><svg viewBox="0 0 100 100"><path id="ar'+i+'" d="M 25,55 L 45,70 L 75,35 "/></svg></i>'+getNameByLabel(arrLabels[i], numberData, chart)+'</span></label>';
		document.querySelector(wrapDom+DOM.checkboxWrap).insertAdjacentHTML('beforeend', string);
	}
}

function getCurrentYProportion(currentY, max) {
	return currentY * 100 / max;
}

function renderPart(el, x_start, x_end, max, renderAdditems, numberOfChartsY, arrLabels, yDataArr, numberData, chart, arrDates, countAllX) {
	
	if(renderAdditems) {
	
		//var divHorWrap = document.createElement('div');
		//divHorWrap.className = DOM.hor;	
		//document.querySelector(wrapDom+el + ' .'+DOM.subInBar).appendChild(divHorWrap);
	

		//render X dates
		//var allSpanX = '';
		//for(var i = x_start; i < x_end - 1; i++) {
		//
		//var strWithDataTooltip = '<div class="'+DOM.tooltipWrapY+'">';
		//for(var k = 0; k < numberOfChartsY; k++) {
		//	strWithDataTooltip += '<div><div style="color:'+getColorByLabel(arrLabels[k], numberData, chart)+'"><strong>'+kFormatter(yDataArr[k][i])+'</strong></div><div style="color:'+getColorByLabel(arrLabels[k], numberData, chart)+'">'+arrLabels[k]+'</div></div>';
		//}
		//strWithDataTooltip += '</div>';		
		//
		//	allSpanX += '<span data-id='+i+'><div class="'+DOM.dataWrap+'"><div class="relative"><div class="'+DOM.d+'">'+prettyDate(arrDates[i], 'DDD, MMM dd')+'</div>'+strWithDataTooltip+'</div></div><i>'+prettyDate(arrDates[i], 'MMM dd')+'</i></span>';
		//}
		//document.querySelector(wrapDom+el + ' '+DOM.horGridWrap).innerHTML = '';
		//document.querySelector(wrapDom+el + ' '+DOM.horGridWrap).insertAdjacentHTML('beforeend',allSpanX);	
		//render X dates
		
		

	}
	
	
		var oneDot = (100 / (x_end - 1)); // 0.8928571428571429
		var svgPath = '<div class="wrapSvgPath"><svg class="svgPath" viewBox="0 0 100 100" preserveAspectRatio="none" style="width: calc(100%); height: calc(100.0%);position:absolute;top:0;left:0;">';	
	
	
	for(var k = 0; k < numberOfChartsY; k++) {

		
		svgPath += '<polyline class="poly_y poly_'+arrLabels[k]+'" vector-effect="non-scaling-stroke" stroke-width="2" fill="none" points="';
		
		//CHECK
		for(var i = x_start; i < x_end; i++) {
			svgPath+=' '+(oneDot*i)+','+getCurrentYProportion(yDataArr[k][i], max); 
		}
		
		svgPath += '"></polyline>';
		
		if(renderAdditems) {
			svgPath += '<line class="pseudoCircleBig pseudoCircle_'+arrLabels[k]+'"  x1="0" y1="0" x2="0" y2="0" style="stroke-linecap:round;stroke-width:10px;vector-effect:non-scaling-stroke" />';
			svgPath += '<line class="pseudoCircleSmall pseudoCircleSmall_'+arrLabels[k]+'"  x1="0" y1="0" x2="0" y2="0" style="stroke-linecap:round;stroke-width:7px;vector-effect:non-scaling-stroke" />';
		}
	}
	
	
	svgPath += '</svg></div>';
	
	
	document.querySelector(wrapDom+el+ ' .sub').insertAdjacentHTML('beforeend', svgPath);
	
	

}

function renderWrapperBar(el, x_start, x_end, numberOfChartsY, arrLabels) {
	var divSub = document.createElement('div');
	divSub.className = DOM.subInBar;	
	document.querySelector(wrapDom+el).appendChild(divSub);
	
	
	//for(var k = 0; k < numberOfChartsY; k++) {
	//	var div = document.createElement('div');
	//	div.className = 'y ' + arrLabels[k];
	//	document.querySelector(wrapDom+el + ' .' + DOM.subInBar).appendChild(div);
//}
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

function generateCSS(sheet, arrLabels, numberOfChartsY, numberData, chart) {
	for(var k = 0; k < numberOfChartsY; k++) {
		var selector = arrLabels[k];
		
		var strDotsY = wrapDom+'.'+selector + ' ' + '.'+DOM.yn_dot+' {background:'+getColorByLabel(selector,numberData, chart)+' !important;}';
		//var strLines = '.'+selector + ' ' + 'svg line {stroke:'+getColorByLabel(selector,numberData, chart)+' !important;}';
		var strLinesPoly = wrapDom+'polyline.poly_'+arrLabels[k]+' {stroke:'+getColorByLabel(selector,numberData, chart)+' !important;}';
		var pseudoCircleCss = wrapDom+'.pseudoCircle_'+arrLabels[k]+' {stroke:'+getColorByLabel(selector,numberData, chart)+' !important;}';
		
		sheet.insertRule(strDotsY, 0);
		//sheet.insertRule(strLines, 0);
		sheet.insertRule(strLinesPoly, 0);
		sheet.insertRule(pseudoCircleCss, 0);
	}
}

var sheet = (function() {
	var style = document.createElement("style");
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
	return style.sheet;
})();

//
function getActiveChecked(checkboxesArr) {
	var getAllChecked = [];
	checkboxesArr.forEach(function(a) {
		getAllChecked.push(a.checked);
	});
	return getAllChecked;	
}
//
function hideUncheked(i, wrapDom) {		
	var sel = 'poly_y'+i.getAttribute('data-number-checkbox');
	
	var twoLines = document.querySelectorAll(wrapDom+'.'+sel);
	var twoLinessArr = [].slice.call(twoLines);
	
	twoLinessArr.forEach(function(i) {
		i.classList.toggle('hide');
	});	
}


function setEventListeners(ch, arrDates, checkboxesArr, yDataArr, numberOfChartsY, chartLength, countAllX, wrapDom, chartMaxYAll,numberData,chart, arrLabels) {
	
	document.querySelector(wrapDom+'.myhover').addEventListener('mousemove', showTooltipFn);	//myhover
	
	function showTooltipFn(event) {
			if(getActiveChecked(checkboxesArr).indexOf(true) !== -1)  {
			var countAllX = arrDates.length;
			var sliderAllWidth = document.querySelector(wrapDom + DOM.bigBar).offsetWidth;
			var widthSlider = document.querySelector(wrapDom + DOM.slider_chart).offsetWidth;
			var leftOfSlid = parseFloat(document.querySelector(wrapDom+DOM.slider_chart).style.left.replace('px',''));
			
			//console.log(leftOfSlid);
			var leftStartCurPozX = Math.round(countAllX * leftOfSlid / sliderAllWidth); //112 * 40 - 0
	
			
			var numberCurX = Math.round(countAllX / (sliderAllWidth / widthSlider));
			//console.log(numberCurX);
			var rightStartCurX = leftStartCurPozX + numberCurX;
			

			//console.log(event);
			//console.log(`
			//	${leftOfSlid} leftOfSlid
			//	${leftStartCurPozX} leftStartCurPozX
			//	${countAllX} countAllX
			//	${numberCurX} numberCurX
			//	${rightStartCurX}  rightStartCurX
			//`);
			
		var wrapObj = document.querySelector(wrapDom + '.slider_chart_wrap');	
		var percentOnCurDisplay = (event.clientX-wrapObj.offsetLeft) / wrapObj.offsetWidth * 100;
		//console.log(percentOnCurDisplay);
		
		var curDot = Math.round(leftStartCurPozX + (percentOnCurDisplay * numberCurX / 100));
		//console.log(curDot);
		//
		
		//console.log(curDot);
		
		//console.log(percentOnCurDisplay);
		//console.log(curDot);
		
		//console.log(x_end);
		
		
	var wrapDomDataObj = document.querySelector(wrapDom+'.'+DOM.dataWrap);
	var strWithDataTooltip = '';
	//var toolTipDots = '';
	curMax = arrmax(getMax(leftStartCurPozX,rightStartCurX,getActiveChecked(checkboxesArr), yDataArr));
	
	for(var k = 0; k < numberOfChartsY; k++) {
		var colorCur = getColorByLabel(arrLabels[k], numberData, chart);
		strWithDataTooltip += '<div><div style="color:'+colorCur+'"><strong>'+kFormatter(yDataArr[k][curDot])+'</strong></div><div style="color:'+colorCur+'">'+arrLabels[k]+'</div></div>';
		
		var curCircleX = (100 / (countAllX - 1));
		
		var bigCircle = document.querySelector(wrapDom+'.pseudoCircle_'+arrLabels[k]);
		var smallCircle = document.querySelector(wrapDom+'.pseudoCircleSmall_'+arrLabels[k]);
		
		
		if(arrDates[curDot]) {
			bigCircle.setAttribute('x1', curDot*curCircleX);
			bigCircle.setAttribute('x2', curDot*curCircleX);
			bigCircle.setAttribute('y1', getCurrentYProportion(yDataArr[k][curDot], chartMaxYAll));
			bigCircle.setAttribute('y2', getCurrentYProportion(yDataArr[k][curDot], chartMaxYAll));
			
			smallCircle.setAttribute('x1', curDot*curCircleX);
			smallCircle.setAttribute('x2', curDot*curCircleX);
			smallCircle.setAttribute('y1', getCurrentYProportion(yDataArr[k][curDot], chartMaxYAll));
			smallCircle.setAttribute('y2', getCurrentYProportion(yDataArr[k][curDot], chartMaxYAll));
		}		
	}
	
	if(arrDates[curDot]) {//check on edges
	
		document.querySelector(wrapDom+'.'+DOM.d).innerHTML = prettyDate(arrDates[curDot], 'DDD, MMM dd');
		document.querySelector(wrapDom+'.'+DOM.tooltipWrapY).innerHTML = strWithDataTooltip;	
		
		
		if(percentOnCurDisplay >= 8 && percentOnCurDisplay <= 92) {
			wrapDomDataObj.style.left = percentOnCurDisplay + '%';
			wrapDomDataObj.style.transform = 'translateX(-50%)';
			wrapDomDataObj.style.right = 'auto';
		}
		else if(percentOnCurDisplay < 8 ) {
			wrapDomDataObj.style.left = 0 + '%';
			wrapDomDataObj.style.right = 'auto';
			wrapDomDataObj.style.transform = 'translateX(0%)';
		}
		else {
			wrapDomDataObj.style.right = 0 + '%';
			wrapDomDataObj.style.left = 'auto';
			wrapDomDataObj.style.transform = 'translateX(0%)';
		}
		
		wrapDomDataObj.style.display = 'block';	
		
		var arrCircles = document.querySelectorAll(wrapDom+'.svgPath line');//circles
		var arrCirclesArr = [].slice.call(arrCircles);
		arrCirclesArr.forEach(function(i) {i.style.display = 'block';});	
		
	}
		//
		
		
			}//if we have data
	}//showTooltipFn
	
	
	document.querySelector(wrapDom+'.myhover').addEventListener('mouseleave', function() {
		document.querySelector(wrapDom+'.'+DOM.dataWrap).style.display = 'none';
		
		var arrCircles = document.querySelectorAll(wrapDom+'.svgPath line');//circles
		var arrCirclesArr = [].slice.call(arrCircles);
		arrCirclesArr.forEach(function(i) {i.style.display = 'none';});			
	});
	
	
	var canAnimate = true;
	//
	var elSlidMove = document.querySelector(wrapDom+DOM.slider_chart);
	var elBigBar = document.querySelector(wrapDom+DOM.bigBar);
	
	var div = DOM.slider_chart;
	var element = document.querySelector(wrapDom+div);

	var resizerLeft = document.querySelector(wrapDom+div + ' '+DOM.resizerLeft);
	var resizerRight = document.querySelector(wrapDom+div + ' '+DOM.resizerRight);

	var minimum_size = 100;
	var original_width = 0;
	var original_x = 0;
	var original_mouse_x = 0;
	
	var widthSlider, sliderAllWidth;
	var handler = moveSlider.bind(this);
	
	var coords, shiftX, shiftL, coordsL, coordsR, shiftR, helperForLeftBouning, countAllX, optimalDatesPerWidth;


	document.querySelector(wrapDom+DOM.slider_chart).addEventListener('mousedown', function(e) {
		if(e.target.className !== DOM.resizerLeftClass && e.target.className !== DOM.resizerRightClass) {//чтобы не ездила когда я делаю ресайз
		
			coords = getCoords(elSlidMove);//чтобы высчитать сдвиг
			shiftX = e.pageX - coords.left;		
			
			updateInfoAboutSlider();
			document.addEventListener('mousemove', handler);
			document.addEventListener('mouseup', stopMovingSlider);
		}
		
		/////////for ALL
		optimalDatesPerWidth = Math.floor(elBigBar.offsetWidth / 70);
		document.querySelector(wrapDom+'.'+DOM.dataWrap).style.display = 'none';
		
		var arrCircles = document.querySelectorAll(wrapDom+'.svgPath line');//circles
		var arrCirclesArr = [].slice.call(arrCircles);
		arrCirclesArr.forEach(function(i) {i.style.display = 'none';});			
	});	
	
	
	resizerLeft.addEventListener('mousedown', function(e) {	
	
		coordsL = getCoords(elSlidMove);//чтобы высчитать сдвиг
		shiftL = e.pageX - coordsL.left;
			
		helperInitResizers(e);
		window.addEventListener('mousemove', resizeLeft);
		window.addEventListener('mouseup', stopResizeLeft); 
	});

	resizerRight.addEventListener('mousedown', function(e) {
	
		coordsR = getCoords(document.querySelector(wrapDom+DOM.resizerRight));//чтобы высчитать сдвиг
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
	
	function getCoords(elem) {
		var box = elem.getBoundingClientRect();

		return {
		top: box.top + pageYOffset,
		left: box.left + pageXOffset
		};
	}

	function moveSlider(e) {	
	
		changeSubWidth();
		infoCurentZoom();
		goFlex();
		
		var x = e.pageX - shiftX - elSlidMove.parentNode.offsetLeft;
		
		if(x <= 0) {x = 0;}
		else if(x >= sliderAllWidth - widthSlider) {x = sliderAllWidth - widthSlider;}
		
		elSlidMove.style.left = x + 'px';
		elBigBar.scrollLeft = x * (elBigBar.scrollWidth / elBigBar.offsetWidth);
	}
	
	function infoCurentZoom() {
	
		var leftOfSlid = parseFloat(element.style.left.replace('px',''));
		var leftStartCurPozX = Math.round(countAllX * leftOfSlid / sliderAllWidth); //112 * 40 (odstup) / 1000 - shirslid
		
		var numberCurX = Math.round(countAllX / (sliderAllWidth / widthSlider));
		
		var rightStartCurX = leftStartCurPozX + numberCurX;
		
	//render X dates (need after processing cur positions)
	var allSpanX = '';
	var partXDates = Math.floor((numberCurX-1) / 5);
	
	for(var i = 0; i < 5; i++) {	
		allSpanX += '<span data-id='+i+'><i>'+prettyDate(arrDates[leftStartCurPozX + partXDates*i], 'MMM dd')+'</i></span>';
	}
	allSpanX += '<span data-id="last"><i>'+prettyDate(arrDates[rightStartCurX-1], 'MMM dd')+'</i></span>';
	
	document.querySelector(wrapDom+DOM.horGridWrap).innerHTML = '';
	document.querySelector(wrapDom+DOM.horGridWrap).insertAdjacentHTML('beforeend',allSpanX);
	//render X dates		
		
		
		//onlyforResize
		
		//var everyThisXToHide = Math.ceil(numberCurX / optimalDatesPerWidth);
		////console.log(everyThisXToHide);
		//for(var i = leftStartCurPozX; i <= rightStartCurX; i++) {
		//	var selector = document.querySelector(wrapDom+'.hor span[data-id="'+i+'"] i');
		//	if(i % everyThisXToHide == 0)  {//оставляю каждый четвертый/второй итп
		//		if(selector) {
		//			selector.classList.add(DOM.displayHorLabelDate);
		//		}
		//	}
		//	else {
		//		if(selector) {
		//			selector.classList.remove(DOM.displayHorLabelDate);
		//		}
		//	}
		//}
		
		
		curMax = arrmax(getMax(leftStartCurPozX,rightStartCurX,getActiveChecked(checkboxesArr), yDataArr));
		generateVertGrid(curMax, wrapDom);

	
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
	

	if(e.pageX - shiftL - elSlidMove.parentNode.offsetLeft >= 0) {//after need to 

        var width = original_width - (e.pageX - original_mouse_x);
		
		
        if (width > minimum_size) {
		updateInfoAboutSlider();
		goFlex();
		changeSubWidth();
		infoCurentZoom();
	
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

		//console.log(e.pageX - elSlidMove.parentNode.offsetLeft);
		if(e.pageX - elSlidMove.parentNode.offsetLeft + (resizerRight.offsetWidth - shiftR) <= sliderAllWidth) {
			
			var width = original_width + (e.pageX - original_mouse_x);
			
			if (width > minimum_size) {
					
				
				goFlex();
				changeSubWidth();	
				infoCurentZoom();
			
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
	
	
	
	ch.forEach(function(g) {
		g.onchange = function(e){		
		//
			g.nextSibling.classList.toggle('noneChecked');
			hideUncheked(g, wrapDom);
			
			updateInfoAboutSlider();
			document.querySelector(wrapDom+'.'+DOM.dataWrap).style.display = 'none';
			var arrCircles = document.querySelectorAll(wrapDom+'.svgPath line');//circles
			var arrCirclesArr = [].slice.call(arrCircles);
			arrCirclesArr.forEach(function(i) {i.style.display = 'none';});				
			
			//which tooltip are shown
			
			//no-data-to-show
			var noDataBlock = document.querySelector(wrapDom + '.wrapGrids .no-data');
			var vertDivChange = document.querySelector(wrapDom + '.vert');
			var horDivChange = document.querySelector(wrapDom + '.hor');
			var subDivChange = document.querySelector(wrapDom + '.sub');
			var sliderChange = document.querySelector(wrapDom + '.slider_chart_wrap');
			
			if(getActiveChecked(checkboxesArr).indexOf(true) === -1)  {
				noDataBlock.innerHTML = 'No Data available';
				noDataBlock.classList.remove('hideChange');
				
				vertDivChange.classList.add('hideChange');
				horDivChange.classList.add('hideChange');
				subDivChange.classList.add('hideChange');
				sliderChange.classList.add('hideChange');		
    
				return;
			}
			else {
				noDataBlock.innerHTML = '';
				noDataBlock.classList.add('hideChange');//hide
				
				vertDivChange.classList.remove('hideChange');
				horDivChange.classList.remove('hideChange');
				subDivChange.classList.remove('hideChange');
				sliderChange.classList.remove('hideChange');					
			}
			
			goFlex();
			//
			
			//updateSmallBar
			var curMaxSmall = arrmax(getMax(0,chartLength,getActiveChecked(checkboxesArr), yDataArr));
			var propSmall = (curMaxSmall / chartMaxYAll) * 100;
			document.querySelector(wrapDom+DOM.smallBar+' .svgPath').style.height = (100 / (propSmall/100)) + '%';		
			
			//
			var leftOfSlid = parseFloat(element.style.left.replace('px',''));
			var leftStartCurPozX = Math.round(countAllX * leftOfSlid / sliderAllWidth); //112 * 40 (odstup) / 1000 - shirslid
			
			var numberCurX = Math.round(countAllX / (sliderAllWidth / widthSlider));
			var rightStartCurX = leftStartCurPozX + numberCurX;
		
			curMax = arrmax(getMax(leftStartCurPozX,rightStartCurX,getActiveChecked(checkboxesArr), yDataArr));
			generateVertGrid(curMax, wrapDom);			
		
		}
	});
	
	//
	
	function goFlex() {
		var leftOfSlid = parseFloat(element.style.left.replace('px',''));
		var leftStartCurPozX = Math.round(countAllX * leftOfSlid / sliderAllWidth); //112 * 40 (odstup) / 1000 - shirslid
		var numberCurX = Math.round(countAllX / (sliderAllWidth / widthSlider));	
		var rightStartCurX = leftStartCurPozX + numberCurX;
		
		//console.log(`${chartMaxYAll} max`);
		
		var curMaxBig = arrmax(getMax(leftStartCurPozX,rightStartCurX,getActiveChecked(checkboxesArr), yDataArr));
		var propBig = (curMaxBig / chartMaxYAll) * 100;
		document.querySelector(wrapDom+DOM.bigBar+' .svgPath').style.height = (100 / (propBig/100)) + '%';
		//	
		

	//console.log(chartMaxYAll);
		
		
	}//goflex
		
		

		
}	



//
function getMax(x_start, x_end, whichActive, yDataArr) {
	var tempArrActiveY = [];
	for(var i = 0;i<whichActive.length;i++) {
		if(whichActive[i] == true) {
			tempArrActiveY.push(yDataArr[i].slice(x_start, x_end));
		}
	}
	return tempArrActiveY;
}

function generateVertGrid(max, wrapDom) {
	var roundMax = Math.ceil(max / 10) * 10
	var part = roundMax / 5;
	var str='';
	for(var i=0;i<5;i++) {
		var hideFirst = i === 0 ? 'style="display:none;"' : '';
		str += '<span><i '+hideFirst+'>'+(kFormatter(roundMax - part*i)) +'</i></span>';
	}
	document.querySelector(wrapDom+DOM.vertGridWrap).innerHTML = '';
	document.querySelector(wrapDom+DOM.vertGridWrap).insertAdjacentHTML('beforeend',str);
	
	if (document.querySelector(wrapDom+DOM.vertGridWrap).className.split(/\s+/).indexOf("anim_vert") === -1) {
		document.querySelector(wrapDom+DOM.vertGridWrap).classList.add('anim_vert');
	setTimeout(function(){document.querySelector(wrapDom+DOM.vertGridWrap).classList.remove('anim_vert');}, 1000);
	}
}
	

//////////////////////////////////////////////////////////////////////////////////////

function loadJSON(callback) {   
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'http://95.142.39.2/bd/tg/chart_data.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(JSON.parse(xobj.responseText));
    }
  };
  xobj.send(null);  
}

var DOM, wrapDom;
loadJSON(function(json) {
	myLoadJson(json);
});

function myLoadJson(json) {

var chart = json;
//console.log(chart);

function generate(nr_chart, heading, chart) {
	
	//if(nr_chart === 0) {console.log(true);}
	
	wrDomClass = 'w'+nr_chart;
	wrapDom = '.w'+nr_chart+' ';

	DOM = {
		bigBar: '.bigBar',
		smallBar: '.smallBar',
		yn_dot: 'simpleY',
		checkboxLineY: 'checkboxLineY',
		checkboxWrap: '.checkBoxWrap',
		vertGridWrap: '.vert',
		horGridWrap: '.hor',
		slider_chart: '.slider_chart',
		subInBar: 'sub',
		tooltipWrapY: 'tooltipWrapY',
		data: 'data',
		dataWrap: 'dataWrap',
		d: 'd',
		resizerLeft: '.resizer.bottom-left',
		resizerRight: '.resizer.bottom-right',
		resizerLeftClass: 'resizer bottom-left',
		resizerRightClass: 'resizer bottom-right',
		displayHorLabelDate: 'displayHorLabelDate',
		hor: 'hor',
	}
	
	var layout = '<div class="wrapper w'+nr_chart+'"><div class="followers">'+heading+'</div><div class="wrapGrids"><div class="dataWrap"><div class="'+DOM.data+'"><div class="'+DOM.d+'">HERE DATE</div><div class="'+DOM.tooltipWrapY+'">HERE INFO</div></div></div><!--tooltip--><div class="no-data"></div><div class="vert"></div><div class="hor"></div><div class="myhover"></div><div class="wrapBigBar"><div class="bigBar"></div></div></div><div class="wrapSmallNDrag"><div class="wrapSmallBarAbs"><div class="smallBar"></div></div></div><div class="slider_chart_wrap"><div class="slider_chart"><div class="resizers"><div class="resizer bottom-left"></div><div class="resizer bottom-right"></div></div></div></div><div class="checkBoxWrap"></div></div>';

	document.querySelector('body').insertAdjacentHTML('beforeend', layout);
	
	var numberData = nr_chart;
	
	var chartLength = chart[numberData].columns[0].length - 1;//10
	var numberOfChartsY = chart[numberData].columns.length - 1;//2
	
	var arrLabels = getYLabels(numberData, numberOfChartsY, chart);
	var yDataArr = generateAllDotsY(numberData, numberOfChartsY, chart);
	var arrDates = chart[numberData].columns[0];
	arrDates.shift();

	var arrAllPoints = generateAllPoints(numberOfChartsY, chartLength, yDataArr);
	
	generateCSS(sheet, arrLabels, numberOfChartsY, numberData, chart);
	//
	createCheckboxes(numberOfChartsY, numberData, chart, arrLabels, wrDomClass);
	var checkboxes = document.querySelectorAll(wrapDom+'.'+DOM.checkboxLineY+ ' input');
	var checkboxesArr = [].slice.call(checkboxes);
	
	var countAllX = arrDates.length;
	
	var chartMaxYAll = arrmax(getMax(0,chartLength,getActiveChecked(checkboxesArr), yDataArr));
	var chartMaxYPart = arrmax(getMax(0,numberCurX,getActiveChecked(checkboxesArr), yDataArr));	
	setEventListeners(checkboxesArr, arrDates, checkboxesArr, yDataArr, numberOfChartsY, chartLength, countAllX, wrapDom, chartMaxYAll,numberData,chart, arrLabels);
	//
	var numberCurX = Math.round(arrDates.length / (document.querySelector(wrapDom+DOM.bigBar).offsetWidth / document.querySelector(wrapDom+DOM.slider_chart).offsetWidth));


	renderWrapperBar(DOM.bigBar, 0, chartLength, numberOfChartsY, arrLabels);
	renderWrapperBar(DOM.smallBar, 0, chartLength, numberOfChartsY, arrLabels);
	renderPart(DOM.smallBar, 0, chartLength, chartMaxYAll, false, numberOfChartsY, arrLabels, yDataArr, numberData, chart, arrDates, countAllX);
	renderPart(DOM.bigBar, 0, chartLength, chartMaxYAll, true, numberOfChartsY, arrLabels, yDataArr, numberData, chart, arrDates, countAllX);
	
	////init
	widthSlider = document.querySelector(wrapDom+DOM.slider_chart).offsetWidth;
	sliderAllWidth = document.querySelector(wrapDom+DOM.bigBar).offsetWidth;
	document.querySelector(wrapDom+DOM.bigBar).querySelector(wrapDom+'.'+DOM.subInBar).style.width = (sliderAllWidth / widthSlider * 100) +"%";
	document.querySelector(wrapDom+DOM.slider_chart).style.left = "0";
	document.querySelector(wrapDom+DOM.bigBar).scrollLeft = 0;
	
	
	var leftOfSlid = parseFloat(document.querySelector(wrapDom+DOM.slider_chart).style.left.replace('px',''));//0
	var leftStartCurPozX = Math.round(countAllX * leftOfSlid / sliderAllWidth); //112 * 40 - 0
	
	var countAllX = arrDates.length;
	var numberCurX = Math.round(countAllX / (sliderAllWidth / widthSlider));
	//console.log(numberCurX);
	var rightStartCurX = leftStartCurPozX + numberCurX;
	

	//render X dates (need after processing cur positions)
	var allSpanX = '';
	var partXDates = Math.floor((numberCurX-1) / 5);
	
	for(var i = 0; i < 5; i++) {	
		allSpanX += '<span data-id='+i+'><i>'+prettyDate(arrDates[leftStartCurPozX + partXDates*i], 'MMM dd')+'</i></span>';
	}
	allSpanX += '<span data-id="last"><i>'+prettyDate(arrDates[rightStartCurX-1], 'MMM dd')+'</i></span>';
	
	document.querySelector(wrapDom+DOM.horGridWrap).innerHTML = '';
	document.querySelector(wrapDom+DOM.horGridWrap).insertAdjacentHTML('beforeend',allSpanX);
	//render X dates	
	
	//initDates
	//var optimalDatesPerWidth =  Math.floor(sliderAllWidth / 70);
	
	//var everyThisXToHide = Math.ceil(numberCurX / optimalDatesPerWidth);
	//for(var i = 0; i <= rightStartCurX; i++) {
	//	var selector = document.querySelector(wrapDom+'.hor span[data-id="'+i+'"] i');
	//	if(i % everyThisXToHide == 0)  {//оставляю каждый четвертый/второй итп
	//		if(selector) {
	//			selector.classList.add(DOM.displayHorLabelDate);
	//		}
	//	}
	//	else {
	//		if(selector) {
	//			selector.classList.remove(DOM.displayHorLabelDate);
	//		}
	//	}
	//}
	//initDates
	
	//
	var curMaxBig = arrmax(getMax(0,rightStartCurX,getActiveChecked(checkboxesArr), yDataArr));
	var propBig = (curMaxBig / chartMaxYAll) * 100;
	document.querySelector(wrapDom+DOM.bigBar+' .svgPath').style.height = (100 / (propBig/100)) + '%';
	//	
	var curMaxSmall = arrmax(getMax(0,chartLength,getActiveChecked(checkboxesArr), yDataArr));
	var propSmall = (curMaxSmall / chartMaxYAll) * 100;
	document.querySelector(wrapDom+DOM.smallBar+' .svgPath').style.height = (100 / (propSmall/100)) + '%';	
	
	generateVertGrid(arrmax(getMax(0,numberCurX,getActiveChecked(checkboxesArr), yDataArr)), wrapDom);
	
	
	//
	
	var allLabelsChecks = document.querySelectorAll(wrapDom+'.checkboxLineY');
	var allLabelsChecksArr = [].slice.call(allLabelsChecks);

	allLabelsChecksArr.forEach(function(i) {
		i.insertAdjacentHTML('beforeend', '<b></b>');
		i.addEventListener('touchstart', function() {		
			i.classList.remove('animate_check');
			setTimeout(function(){i.classList.add('animate_check');}, 10);
			setTimeout(function(){i.classList.remove('animate_check');}, 500);
		});
	});
	
	//
	
}

nightfn();
generate(0, 'Followers', chart);
generate(1, 'Heading 2', chart);
generate(2, 'Heading 3', chart);
generate(3, 'Heading 4', chart);
generate(4, 'Heading 5', chart);

//

}

mapTouchEvents();
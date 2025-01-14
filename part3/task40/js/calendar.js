/*不要再去计算平年闰年的方法以及switch语句去计算月份天数了,浪费了Date对象强大的功能!*/
(function($){
	function Calendar(options){
		this.options = options;
		console.log(this.options)
		var date = new Date();
		// 需要使用日历功能的文本框
		this.input = document.querySelector('[data-calendar]');
		//哪一年
		this.year = date.getFullYear();
		//几月
		this.month = date.getMonth()+1;
		//几号
		this.day = date.getDate();
		//星期几
		this.init();
	}
	Calendar.prototype = {
		init : function(){
			this.initDom();
			this.initProperty();
			this.paint(this.year, this.month)
			this.initEvent();
		},
		initEvent : function(){
			//输入框有焦点时弹出日历
			this.input.onfocus = function(){
				console.log("显示日历")
			}
			this.input.onblur = function(){
				console.log("隐藏日历")
			}
		},
		initProperty : function(){
			var str = this.year + '/' + this.month + '/' + this.day;
			this.input.placeholder = str;
		},
		initDom : function(){
			var calendar = document.createElement('div');
			calendar.id = 'calendar';
			calendar.className = this.options.calendarClass;
			var selectBox = document.createElement('div');
			var selectYear = document.createElement('select');
			selectYear.id = 'year';
			for(i = 1995 ; i < 2016 ; i ++){
				var option = document.createElement('option')
					option.value = i;
				option.innerHTML = i;
				selectYear.appendChild(option)
			}
			var selectMonth = document.createElement('select');
			selectMonth.id = 'month';
			for(var i = 1 ; i < 13 ; i ++){
				var option = document.createElement('option')
				option.value = i;
				option.innerHTML = i;
				selectMonth.appendChild(option)
			}
			var selectDay = document.createElement('select');
			selectDay.id = 'day';
			var monthLength = this.getMonthLength();
			for(var i = 1 ; i < monthLength ; i ++){
				var option = document.createElement('option')
				option.value = i;
				option.innerHTML = i;
				selectDay.appendChild(option)
			}
			
			selectBox.appendChild(selectYear)
			var yearLabel = document.createElement('label');
			yearLabel.innerHTML = '年'
			selectBox.appendChild(yearLabel)

			selectBox.appendChild(selectMonth)
			var monthLabel = document.createElement('label');
			monthLabel.innerHTML = '月'
			selectBox.appendChild(monthLabel)

			selectBox.appendChild(selectDay)
			var dayLabel = document.createElement('label');
			dayLabel.innerHTML = '日'
			selectBox.appendChild(dayLabel)

			calendar.appendChild(selectBox)
			var node = this.input.nextElementSibling;
			document.body.insertBefore(calendar, node)
			// var year = document.querySelector('#year').value;
			// var month = document.querySelector('#month').value;
			// var day = document.querySelector('#day').value;
			
			// console.log(year)
			// console.log(month)
			// console.log(day)
		},
		paint : function(year, month){
			var calendar = document.querySelector('#calendar');
			var table = document.createElement('table');
			var arr = this.arr;
			var th = document.createElement('tr');
			th.innerHTML = '<th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th>';
			table.appendChild(th);

			var curArrHeight = this.getArrHeight(year,month);
			var monthLength = this.getMonthLength(year,month);
			var firstDay = this.getFirstDay(year,month);
			var preMonthLength = this.getMonthLength(year, month - 1)
			var pre = [];
			for(var i = firstDay ; i > 0 ; i --){
				pre.push(preMonthLength - i)
			}
			
			// var arr = new Array(curArrHeight);
			var cellClass = this.options.cellClass;
			var uesdClass = cellClass + ' ' +this.options.uesdClass;
			var p = 1;
			var q = 1;
			for(var i = 0 ; i < curArrHeight ; i ++){
				var tr = document.createElement('tr')
				for(var j = 0 ; j < 7 ; j ++){
					var td = document.createElement('td')
					if(i == 0){
					//首行
						if(j < firstDay){
							td.innerHTML = pre.shift();
							td.className = cellClass;
						}else{
							td.innerHTML = p++;
							td.className = uesdClass;
							if(td.innerHTML == this.day){
								td.className += ' active'
							}
						}
					}
					else if(i == curArrHeight - 1){
					//末行
						if(p <= monthLength){
							td.innerHTML = p++;
							td.className = uesdClass;
							if(td.innerHTML == this.day){
								td.className += ' active'
							}
						}else{
							td.innerHTML = q++;
							td.className = cellClass;
						}
					}else{
						//其他行
						td.innerHTML = p++;
						td.className = uesdClass;
						if(td.innerHTML == this.day){
							td.className += ' active'
						}
					}
					tr.appendChild(td)
				}
				table.appendChild(tr)
			}
			calendar.appendChild(table)
			
			// this.arr = arr;
		},
		// 下个月
		nextMonth : function(){
			if(this.month == 12){
				this.year = this.year + 1;
				this.month = 1;
			}else{
				this.month = this.month + 1	
			}
		},
		// 上个月
		lastMonth : function(){
			if(this.month == 1){
				this.year = this.year - 1;
				this.month = 12;
			}else{
				this.month = this.month - 1	
			}
		},
		//根据年月计算当月有几天
		getMonthLength : function(year, month){
			year = year || new Date().getFullYear();
			//这里有个细节:之前用的是下面这一行,当传入的月份为1时,month-1为0,就去获得当前日期了,所以选择了现在这种写法
			// month = month - 1 || new Date().getMonth();
			month = month || new Date().getMonth() + 1;
			//new Date(year, month, 0)会创建上月的最后一天
			return new Date(year, month, 0).getDate();
		},
		//根据年份和月份给出当月1号是星期几
		getFirstDay : function(year, month){
			year = year || new Date().getFullYear();
			month = month || new Date().getMonth() + 1;
			return new Date(year, month - 1, 1).getDay();
		},
		//根据年份和月份给出当月日历呈现的行数
		getArrHeight : function(year, month){
			var monthLength = this.getMonthLength(year, month);
			var firstDay = this.getFirstDay(year, month);
			var arrHeight = Math.ceil((firstDay + monthLength)/7)
			return arrHeight;
		}
	}
	$.Calendar = function(options){
		return new Calendar(options);
	}
})(jQuery)
import React, {Component} from "react";
import ReactDom from "react-dom";
import {createStore, combineReducers} from "redux";

require("./styles/calendar.css")


let daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31]; // 闰年2月29天，平年28天；
const isLeapYear = (year) => {

	if (year % 4 ==0 && year %100 !=0) {
		return true;
	}
	else if(year % 400 ==0) {
		return true;
	
	}
	else {
		return false;
	}
}
		
const setDaysInMonth = (year) => {
	if (isLeapYear(year)) {
		daysInMonth[1] = 29;
	}
}


const CalendarTitle = () => {
	let today = new Date();
	let year = today.getFullYear(); 
	let month = today.getMonth()+1;
	let date = today.getDate();
	return <div className="calendarTitle"> {year}年{month}月{date}日</div>;
}

const CalendarHeader = ({time, prevClick,nextClick}) => {
	return (
		<div className="calendarHeader">
			<span className="prev" onClick={prevClick}>《 </span>
			<span className="showYM">{time.year}年{time.month}月</span>
			<span className="next" onClick={nextClick}> 》</span>
		</div>
	)

}

class CalendarBody extends Component {


	render(){
		let {time} = this.props;
		let year = time.year;
		let month = time.month;
		let date = time.date;
		let day = time.day;
		let dayNames = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];  

		setDaysInMonth(year);
		
		let days = daysInMonth[month-1];
		let datesInMonth = [];
		
		let prevMonthDays;
		if (month>1) {
			prevMonthDays = daysInMonth[month-2]
		}else{
			prevMonthDays = daysInMonth[11];
		}
	//本月1号是周几？ 
	let start = (day-date%7+8)%7;

		//补充上一月
		for (let i = start; i >0; i--) {
			datesInMonth.push(prevMonthDays-i+1)
		}
		//填充当前月
		for (let i = 1; i <= days; i++) {
			datesInMonth.push(i)
		}

		let fill = 42-days-start;  //日历占6行
		//补充下一月
		for (let i = 1; i <= fill; i++) {
			datesInMonth.push(i)
		}

	    let rowsInMonth = [];

	     //把每一个月的显示数据以7天为一组等分
	    datesInMonth.forEach((date, index)=> {
	      if (index % 7 === 0) {
	        rowsInMonth.push(datesInMonth.slice(index, index + 7))
	      }
	    });	

 
	return (
		<table className="calendarBody">
		<thead>
			<tr>
				{
					dayNames.map((day,index) => {
						return <th key={index} className="day-item">{day}</th>
					})
				}
			</tr>
			</thead>
			<tbody>
			{
				rowsInMonth.map((row, row_index) => {
					return (
						<tr key={row_index}>
							{
								row.map((row_date, index)=> {
									let classname;
									if (row_index*7 + index <start) {
										classname = "date-item inPrevMonth"
									}
									else if (row_index*7 + index > days+start-1) {
										classname = "date-item inNextMonth"
									}	 
									else{
										classname = "date-item";
									}

									return (
										<td key={index} className={classname} onClick={this.props.datePicked}>{row_date}</td>
									)
								})
							}
							
						</tr>);
				})
			}
			</tbody>
		</table>
	);
	}
}


class Calendar extends Component {
	constructor(props){
		super(props);
		let today = new Date();
		let year = today.getFullYear(); 
		let month = today.getMonth()+1;
		let date = today.getDate();
		let day = today.getDay(); //0:sunday, 1:monday
		let time = { year, month, date, day};

		this.state = {time};
		this.prevMonthClick = this.prevMonthClick.bind(this);
		this.nextMonthClick = this.nextMonthClick.bind(this);
		this.datePicked = this.datePicked.bind(this);

	}
	componentDidMount(){
		console.log('state:',this.state);

	}

	prevMonthClick(){
		let {time} = this.state;
		let {year, month, date, day} = time;
		date = 1;
		if (month==1) {
			month=12;
			--year;			
		}else{
			--month;
		}
		let dateString = ""+year+"-"+month+"-"+date;
		day = new Date(dateString).getDay();
		this.setState({time: {year, month,date, day}});
	}

	nextMonthClick(){
		const {time} = this.state;
		let {year, month, date, day} = time;
		date = 1;
		if (month==12) {
			month=1;
			++year;			
		}else{
			++month;
		}
		let dateString = ""+year+"-"+month+"-"+date;
		day = new Date(dateString).getDay();
		this.setState({time: {year, month,date, day}});
	}
	datePicked(e){
		let tds = document.getElementsByTagName('td');
		let td = e.target;
		for (var i = tds.length - 1; i >= 0; i--) {
			tds[i].style.backgroundColor="#fff";
		}
		td.style.backgroundColor = "#a2a2d2";
		let classname = td.className;
		if (classname.indexOf("inPrevMonth")>-1) {
			this.prevMonthClick();
		}else if (classname.indexOf('inNextMonth')>-1) {
			this.nextMonthClick();
		}


	}

	render(){
		const state = this.state;
		return (
			<div className="calendar">
				<CalendarTitle /> 
				<CalendarHeader {...state} prevClick={this.prevMonthClick} nextClick={this.nextMonthClick}/> 
				<CalendarBody {...state} datePicked={this.datePicked}/> 
			</div>
		);
	}
}

const render  = () => {
	ReactDom.render(<Calendar />, document.getElementById('root'));
}

render();

export default Calendar;

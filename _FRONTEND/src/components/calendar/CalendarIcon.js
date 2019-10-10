import React from "react";
import "./Calendar.css"


const CalendarIcon = (props) =>{
    
    const YearMonthDay = (date) =>{
        if (typeof(date)==="string"){
            const splitted = date.split("-");
            return{"year":parseInt(splitted[0]), "month":parseInt(splitted[1]), "day":parseInt(splitted[2]) }
        }
        else if (date instanceof Date){
            return {"year":date.getFullYasdear(), "month":date.getMonth(), "day":date.getDay()}
        }
    }

    const date = YearMonthDay(props.date)
    return(
        <div className="calendar-main">
            <div className="calendar-top">
                {monthName( date.month, 3 )}
            </div>
            <div className="calendar-middle">
                {date.day}
            </div>
            <div className="calendar-bottom">
                {date.year}
            </div>
        </div>
    );
}


function monthName(monthDigit, limit=20) {
    switch(monthDigit){
        case 1:
            return "January".slice(0, limit)
        case 2:
            return "February".slice(0, limit)
        case 3:
            return "March".slice(0, limit)
        case 4:
            return "April".slice(0, limit)
        case 5:
            return "May".slice(0, limit)
        case 6:
            return "June".slice(0, limit)
        case 7:
            return "July".slice(0, limit)
        case 8:
            return "August".slice(0, limit)
        case 9:
            return "September".slice(0, limit)
        case 10:
            return "October".slice(0, limit)
        case 11:
            return "November".slice(0, limit)
        case 1:
            return "December".slice(0, limit)
    }
}



export default CalendarIcon;
function Ts2k_helpers() 
{
	var letter;
	
	this.toMonths = function(data){
		//switches month numbers to names
		var month;
		
		switch(data)
		{
			case 1:
				month = "Jan";
				break;
			case 2:
				month = "Feb";
				break;
			case 3:
				month = "Mar";
				break;
			case 4:
				month = "Apr";
				break;
			case 5:
				month = "May";
				break;
			case 6:
				month = "Jun";
				break;
			case 7:
				month = "Jul";
				break;
			case 8:
				month = "Aug";
				break;
			case 9:
				month = "Sep";
				break;
			case 10:
				month = "Oct";
				break;
			case 11:
				month = "Nov";
				break;
			case 12:
				month = "Dec";
				break;
		}
		
		return month;
	};
	this.swichSlots = function(slotter,day,month,year){
		
		var slot_ret;
		
		if(slotter == "day"){
			slot_ret = day;
		} else if(slotter == "month"){
			slot_ret = month;
		} else {
			slot_ret = year;
		}
		
		return slot_ret;
	};

};

var ts2k_helpers = new Ts2k_helpers();
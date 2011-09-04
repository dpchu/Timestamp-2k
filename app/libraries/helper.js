function Helper() {

	this.molog = function(data){
		//logging
		Mojo.Log.info("********** " + data + " **********");
	};
	//date formatting
	this.mysqlToMilspec = function(date){
		//re-orders into month/day/year
		
		var date_parse = date.split('-');
		
		var date_string = date_parse[1] + "/" + date_parse[2] + "/" + date_parse[0];
		
		return date_string;	
	};
	
	this.milspecToMysql = function(date){
		//re-orders back to mysql timestamp
		
		var parseFromMilspec = date.split('/');
		
		var backToMysql = parseFromMilspec[2] + "-" + parseFromMilspec[0] + "-" + parseFromMilspec[1];	
		
		return backToMysql;
	};
};

var helper = new Helper();
function MainAssistant(cookiePref) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	
	this.myCookie = cookiePref;

	helper.molog("get cookie: " + this.myCookie.get());
	
	AdMob.ad.initialize({
	                pub_id: 'a14c400069813d8', // your publisher id
	                bg_color: '#660066', // optional background color, defaults to #fff
	                text_color: '#333', // optional background color, defaults to #000
	                test_mode: false // optional, set to true for testing ads, remove or set to false for production
	  });

}
MainAssistant.prototype.spacers = function(inTransaction,results){
	
	this.myResults = results.rows.item(0);
	
	if(this.myResults.char_set == 1){
		this.charSpace = "/";
	} else if(this.myResults.char_set == 2){
		this.charSpace = "-";
	} else {
		this.charSpace = "";
	}
	this.slotter_a = this.myResults.slot_a;
	this.slotter_b = this.myResults.slot_b;
	this.slotter_c = this.myResults.slot_c;
	
	this.monthit = this.myResults.month_set;
	this.yearit = this.myResults.year_set;
}	
MainAssistant.prototype.setup = function() {

	devinf = Mojo.Environment.DeviceInfo;
	scrn_h = devinf.screenHeight;

	this.background = new Image();
	this.background.src = "images/ts2k_bg_" + scrn_h + ".png";
	
	if(scrn_h == 400){
				
		$('dts').setStyle({'-webkit-transform' : 'none', 'top' : '115px'});
		$('ds').setStyle({'-webkit-transform' : 'none', 'top' : '173px'});
		$('ts').setStyle({'-webkit-transform' : 'none', 'top' : '230px'});
		$('twentyfour').setStyle({'-webkit-transform' : 'none', 'top' : '288px'});
		
		$("myCanvas480").style.display = "none";
		$("myCanvas400").style.display = "block";
			
	} else if(scrn_h == 480){

		$("myCanvas400").style.display = "none";
		$("myCanvas480").style.display = "block";
			
	}
	
	helper.molog('height is ' + scrn_h + '!');
	helper.molog('bg image is: ' + this.background.src);
	
	$("palmbodytext").addClassName('noscroll_' + scrn_h);
	
	devinf.ctx = $("myCanvas" + scrn_h).getContext("2d");
	devinf.ctx.drawImage(this.background, 0, 0);
	
	AdMob.ad.request({
                onSuccess: (function (ad) { // successful ad call, parameter 'ad' is the html markup for the ad
                        this.controller.get('admob_ad').insert(ad); // place mark up in the the previously declared div
                }).bind(this),
                onFailure: (function () { // no ad was returned or call was unsuccessful
                        // do nothing? 
                        this.admobFail();
                }).bind(this),
    
        });
	
	if(this.myCookie.get() == 'Off'){
	
		this.controller.get('twentyfour').update('24 Hour Clock');
		
	} else if(this.myCookie.get() == 'On') {
		
		this.controller.get('twentyfour').update('12 Hour Clock');
	
	}

	this.controller.setupWidget(Mojo.Menu.appMenu, appmenuAttr, appmenuModel);
	
	this.charSpace = ".";
	
	setInterval(this.timeLoop.bind(this), 1000);

	Mojo.Event.listen(this.controller.get('dts'), Mojo.Event.tap, this.tapDTS.bindAsEventListener(this));
	Mojo.Event.listen(this.controller.get('ds'), Mojo.Event.tap, this.tapDS.bindAsEventListener(this));
	Mojo.Event.listen(this.controller.get('ts'), Mojo.Event.tap, this.tapTS.bindAsEventListener(this));
	Mojo.Event.listen(this.controller.get('twentyfour'), Mojo.Event.tap, this.tapTwentyFour.bindAsEventListener(this));
};
MainAssistant.prototype.admobFail = function(event){
	helper.molog("Admob is Fail, go fast ZOOM ZOOM!");
	this.controller.get('fasturlpro_ad').setStyle({display : 'block'});
	this.controller.get('admob_ad').setStyle({display : 'none'});
	
};

MainAssistant.prototype.tapTwentyFour = function(event){
	
	
	if(this.myCookie.get() == 'On'){
		helper.molog("You have reached twenty four");
		this.controller.get('twentyfour').update('24 Hour Clock');
		this.myCookie.put('Off');
		
	} else if(this.myCookie.get() == 'Off') {
		helper.molog("You have reached twelve");
		this.controller.get('twentyfour').update('12 Hour Clock');
		this.myCookie.put('On');
	
	}
	helper.molog("Cookie set to " + this.myCookie.get());
};
MainAssistant.prototype.tapDTS = function(event){
	
	this.controller.stageController.setClipboard(this.goDTS);
	Mojo.Controller.getAppController().showBanner("Timestamp copied to clipboard",
     {source: 'notification'});
};
MainAssistant.prototype.tapDS = function(event){
	
	this.controller.stageController.setClipboard(this.goDS);
	Mojo.Controller.getAppController().showBanner("Timestamp copied to clipboard",
     {source: 'notification'});
};
MainAssistant.prototype.tapTS = function(event){
	
	this.controller.stageController.setClipboard(this.goTS);
	Mojo.Controller.getAppController().showBanner("Timestamp copied to clipboard",
     {source: 'notification'});
};
MainAssistant.prototype.timeLoop = function(event){
	
	this.controller.serviceRequest('palm://com.palm.systemservice/time', {
	    method:"getSystemTime",
	    parameters:{},
	    onSuccess: this.timeCallback.bind(this),
	    onFailure: function(){helper.molog("time callback isFail.")},
	}); 
	
	dao.db.transaction((function (inTransaction) {
  		inTransaction.executeSql("SELECT * FROM ts2k; GO;", [], 
  		this.spacers.bind(this), 
  		dao.errorHandler); 
	}).bind(this)); 
};


MainAssistant.prototype.timeCallback = function(event){

	this.theMonth = event.localtime.month;
	this.theDay = event.localtime.day;	
	this.theYear = event.localtime.year;
	this.theHour = event.localtime.hour;
	
	this.theMinute = event.localtime.minute;
	this.theSecond = event.localtime.second;
	this.thePM = " pm";
	this.theAM = " am";
	
	if(this.monthit == 2){
		this.theMonth = ts2k_helpers.toMonths(this.theMonth);
	}
	
	if(this.yearit < 2){
		
		var yrJson;
		
		yrJson = Object.toJSON(this.theYear);
		
		this.theYear = yrJson.substr(2,2);
	}
	
	this.slot_a = ts2k_helpers.swichSlots(this.slotter_a,this.theDay,this.theMonth,this.theYear);
	this.slot_b = ts2k_helpers.swichSlots(this.slotter_b,this.theDay,this.theMonth,this.theYear);
	this.slot_c = ts2k_helpers.swichSlots(this.slotter_c,this.theDay,this.theMonth,this.theYear);
	
	if(this.theMinute < 10){
		this.nuMinute = "0" + this.theMinute;
		
	} else {
		this.nuMinute = this.theMinute;
	}
	
	if(this.theSecond < 10){
		this.nuSecond = "0" + this.theSecond;
	} else {
		this.nuSecond = this.theSecond;
	}
	
	if(this.myCookie.get() == 'On'){
			//12 hour clock
			
		if(this.theHour > 12){
		
			this.theHour = this.theHour - 12;
			this.goTS = this.theHour + ":" + this.nuMinute + ":" + this.nuSecond + this.thePM;
			//Mojo.Log.info("************ greater than 12 " + this.goTS);
	
		} else if(this.theHour < 12) {
			
			//turns 0am into 12am
			if(this.theHour == 0){
				this.theHour = 12;
			}
			this.goTS = this.theHour + ":" + this.nuMinute + ":" + this.nuSecond + this.theAM;
			//Mojo.Log.info("************ less than 12 " + this.goTS);
		} else {
			//if the hour is 12
			this.goTS = this.theHour + ":" + this.nuMinute + ":" + this.nuSecond + this.thePM;
			//Mojo.Log.info("************ at 12 " + this.goTS);
		}
			this.goDS = this.slot_a + this.charSpace + this.slot_b + this.charSpace + this.slot_c;		
		
	} else if(this.myCookie.get() == 'Off'){
		//24 hour clock
		
		if(this.theHour < 10){
			this.nuHour = "0" + this.theHour;
		} else {
			this.nuHour = this.theHour;
		}
		
		this.goTS = this.nuHour + ":" + this.nuMinute + ":" + this.nuSecond;
		this.goDS = this.slot_a + this.charSpace + this.slot_b + this.charSpace + this.slot_c;

	}
		this.goDTS =  this.goDS + " " + this.goTS;

	this.controller.get('dts').update(this.goDTS);
	this.controller.get('ds').update(this.goDS);
	this.controller.get('ts').update(this.goTS);

	
};

MainAssistant.prototype.activate = function(event) {

};

MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
	   Mojo.Event.stopListening(this.controller.get("dts"), Mojo.Event.tap, this.tapDTS);
	   Mojo.Event.stopListening(this.controller.get("ds"), Mojo.Event.tap, this.tapDS);
	   Mojo.Event.stopListening(this.controller.get("ts"), Mojo.Event.tap, this.tapTS);
	   Mojo.Event.stopListening(this.controller.get("twentyfour"), Mojo.Event.tap, this.tapTwentyFour);
	   

};

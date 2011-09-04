function SettingsAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

SettingsAssistant.prototype.setup = function() {

	dao.db.transaction((function (inTransaction) {
  		inTransaction.executeSql("SELECT * FROM ts2k; GO;", [], 
  		this.selAll.bind(this), 
  		dao.errorHandler); 
	}).bind(this));

	this.yearModel = {value: 1,disabled: false};
	this.monthModel = {value: 1,disabled: false};
	this.charModel = {value: "/",disabled: false};
	this.slot_aModel = {value: "month",disabled: false};
    this.slot_bModel = {value: "day",disabled: false};
    this.slot_cModel = {value: "year",disabled: false};
    
	this.controller.setupWidget("yearToggle",
        this.yearAttrib = {
        	choices: [
        		{label: "11", value: 1},
        		{label: "2011", value: 2}
        	]
        },
        this.yearModel);
    
    this.controller.setupWidget("monthToggle",
        this.monthAttrib = {
        	choices: [
        		{label: "7", value: 1},
        		{label: "Jul", value: 2}
        	]
        },
        this.monthModel);
    this.controller.setupWidget("charToggle",
    	this.charAttrib = {
    		choices: [
    			{label: "/", value: 1},
    			{label: "-", value: 2},
    			{label: "blank", value: 3}
    		]
    	},
    	this.charModel);
    	
    this.controller.setupWidget("slot_a",
		this.slot_aAttributes ={ 
		choices: [
				{label: "month", value: "a_month"},
				{label: "day", value: "a_day"},
				{label: "year", value: "a_year"}
			]},
		this.slot_aModel);
	this.controller.setupWidget("slot_b",
		this.slot_bAttributes ={ 
		choices: [
				{label: "month", value: "b_month"},
				{label: "day", value: "b_day"},
				{label: "year", value: "b_year"}
			]},
		this.slot_bModel); 
	this.controller.setupWidget("slot_c",
		this.slot_cAttributes ={ 
		choices: [
				{label: "month", value: "c_month"},
				{label: "day", value: "c_day"},
				{label: "year", value: "c_year"}
			]},
		this.slot_cModel); 
		
	Mojo.Event.listen(this.controller.get("yearToggle"), Mojo.Event.propertyChange, this.yearChange);
	Mojo.Event.listen(this.controller.get("monthToggle"), Mojo.Event.propertyChange, this.monthChange);
	Mojo.Event.listen(this.controller.get("charToggle"), Mojo.Event.propertyChange, this.charChange);
	
	Mojo.Event.listen(this.controller.get("slot_a"), Mojo.Event.propertyChange, this.slots.bind(this));
	Mojo.Event.listen(this.controller.get("slot_b"), Mojo.Event.propertyChange, this.slots.bind(this));
	Mojo.Event.listen(this.controller.get("slot_c"), Mojo.Event.propertyChange, this.slots.bind(this));	
};
SettingsAssistant.prototype.selAll = function(inTransaction,results){
	
	this.yearModel = {value: results.rows.item(0).year_set,disabled: false};
	this.monthModel = {value: results.rows.item(0).month_set,disabled: false};
	this.charModel = {value: results.rows.item(0).char_set,disabled: false};
	
	this.slot_aModel = {value: results.rows.item(0).slot_a,disabled: false};
    this.slot_bModel = {value: results.rows.item(0).slot_b,disabled: false};
    this.slot_cModel = {value: results.rows.item(0).slot_c,disabled: false};
    
    this.controller.setWidgetModel( "yearToggle", this.yearModel );
    this.controller.setWidgetModel( "monthToggle", this.monthModel );
    this.controller.setWidgetModel( "charToggle", this.charModel );
    
    this.controller.setWidgetModel( "slot_a", this.slot_aModel );
    this.controller.setWidgetModel( "slot_b", this.slot_bModel );
    this.controller.setWidgetModel( "slot_c", this.slot_cModel );
}
SettingsAssistant.prototype.slots = function(event){

	var slot_select = event.model.value;
	
	var slotter = slot_select.split('_');
	
	var sqlUp = "UPDATE ts2k SET slot_" + slotter[0] + "='" + slotter[1] + "';GO;";
	
	dao.db.transaction((function (inTransaction) {
  		inTransaction.executeSql(sqlUp, [], 
  		function() { }, 
  		dao.errorHandler); 
	}));
}

SettingsAssistant.prototype.monthChange = function(event){
	
	var monthVal = Object.toJSON(event.model.value);
	
	var sqlUp_month = "UPDATE ts2k SET month_set='" + monthVal + "'; GO;";

	dao.db.transaction((function (inTransaction) {
      		inTransaction.executeSql(sqlUp_month, [], 
      		function() { }, 
      		dao.errorHandler); 
    	}));
}
SettingsAssistant.prototype.charChange = function(event){
	
	var charVal = Object.toJSON(event.model.value);
	
	var sqlUp_char = "UPDATE ts2k SET char_set=" + charVal + "; GO;";

	dao.db.transaction((function (inTransaction) {
      		inTransaction.executeSql(sqlUp_char, [], 
      		function() { }, 
      		dao.errorHandler); 
    	}));
}
SettingsAssistant.prototype.yearChange = function(event){
	
	var yearVal = Object.toJSON(event.model.value);
	
	var sqlUp_year = "UPDATE ts2k SET year_set='" + yearVal + "'; GO;";

	dao.db.transaction((function (inTransaction) {
      		inTransaction.executeSql(sqlUp_year, [], 
      		function() { }, 
      		dao.errorHandler); 
    	}));
}
SettingsAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SettingsAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

SettingsAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.controller.get("yearToggle"), Mojo.Event.propertyChange, this.yearChange);
	Mojo.Event.stopListening(this.controller.get("monthToggle"), Mojo.Event.propertyChange, this.monthChange);
	Mojo.Event.stopListening(this.controller.get("charToggle"), Mojo.Event.propertyChange, this.charChange);
	
	Mojo.Event.stopListening(this.controller.get("slot_a"), Mojo.Event.propertyChange, this.slots);
	Mojo.Event.stopListening(this.controller.get("slot_b"), Mojo.Event.propertyChange, this.slots);
	Mojo.Event.stopListening(this.controller.get("slot_c"), Mojo.Event.propertyChange, this.slots);
};

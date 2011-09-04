function StageAssistant() {

	dao.init();
	
	this.prefCookie = new Mojo.Model.Cookie('cookiepref');
	
	this.oldPref = this.prefCookie.get();
	
	Mojo.Log.info("**********COOKIE Something's here from before: " + this.oldPref + "**************");
	
	if(this.oldPref){
		Mojo.Log.info("Last selection of COOKIE was: " + this.oldPref);
	} else {
		this.prefCookie.put('Off');
	}
	//
	//if(this.oldPref){
	//
	//	Mojo.Log.info("Something's here from before: " + this.oldPref);
	//	
	//	this.prefCookie.put(this.oldPref);	
	//
	//} else {
	//	
	//	this.prefCookie.put('Off');
	//}
	
}

StageAssistant.prototype.setup = function() {

	
	
	appmenuAttr = {omitDefaultItems: true};
    appmenuModel = {
        visible: true,
        items: [ 
            Mojo.Menu.editItem,
            {label: "Settings", command: 'do-settings'},
            {label: "Other Cool Apps", command: 'do-othercool'},
            { label: "About", command: 'do-about' }
        ]
    };
	
	appmenuSubModel = {
		 visible: true,
        items: [ 
            Mojo.Menu.editItem,
            { label: "About", command: 'do-about' }
        ]
	}
	
	appmenuSubPrefModel = {
		visible: true,
		items: [
			Mojo.Menu.editItem,
			 {label: "Settings", command: 'do-settings'},
			{ label: "Other Cool Apps", command: 'do-othercool' },
			{ label: "About", command: 'do-about' }
		]
	}

	this.controller.pushScene('main', this.prefCookie);
   
};
StageAssistant.prototype.handleCommand = function(event){

	var currentScene = Mojo.Controller.stageController.activeScene();
	
	this.appTitle = Object.toJSON(Mojo.appInfo.title);
	this.appVersion = Object.toJSON(Mojo.appInfo.version);
	this.appVendor = Object.toJSON(Mojo.appInfo.vendor);
	
	if (event.type === Mojo.Event.command) {
        switch (event.command) {
            case 'do-settings':
            	this.controller.pushScene('settings');
            	break;
            
            case 'do-othercool':
            	this.controller.pushScene('othercool');
            	break;
            
            case 'do-about':
            	currentScene.showAlertDialog({
			    onChoose: function(inValue){},
			    title: $L(this.appTitle),
			    message: $L("Version: " + this.appVersion + " by " + this.appVendor),
			    choices:[
			        {label: "Ok", value:""}    
			    	]
				});
				break;	

    	}
    }
};

function HelpAssistant() {
}

HelpAssistant.prototype.setup = function() {
	// create the drop-down menu
	this.appMenuModel = this.controller.setupWidget(Mojo.Menu.appMenu,
							{omitDefaultItems: true},

							{
								visible: true,
								items: [
										{ label: "About", command: "menu-about"},
							    		{ label: "Preferences", command: "menu-prefs"}
								]
							});
};

HelpAssistant.prototype.activate = function(event) {
	// set correct body class for background image
	this.controller.get("bodyTag").className = "helpScene";
};

HelpAssistant.prototype.deactivate = function(event) {
};

HelpAssistant.prototype.cleanup = function(event) {
};

HelpAssistant.prototype.handleCommand = function(event) {

	// handle drop-down menu commands

	this.controller = Mojo.Controller.stageController.activeScene();

	if(event.type == Mojo.Event.command) {	

		switch (event.command) {

			case "menu-prefs":
				this.controller.stageController.pushScene({name:"prefs"});
			break;
			
			case "menu-about":
				this.controller.showAlertDialog({
					title: $L("About"),
					message: $L("Stop Smoking v0.1.0 by JDF Software http://bit.ly/jdfsoftware http://twitter.com/jdfsoftware Released under New BSD License http://www.jdf-software.com/blog/source"),
					choices:[
	         				{label:$L('Ok'), value:"refresh", type:'affirmative'}
					]				    
				});
			break;
		}

	}

}

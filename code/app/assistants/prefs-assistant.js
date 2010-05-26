function PrefsAssistant() {
}

PrefsAssistant.prototype.setup = function() {
	
	// create the drop-down menu
	this.appMenuModel = this.controller.setupWidget(Mojo.Menu.appMenu,
							{omitDefaultItems: true},

							{
								visible: true,
								items: [
										{ label: "Help", command: "menu-help"},
										{ label: "About", command: "menu-about"}
								]
							});

	/* cookie will store a JSON object like:
	 	{
		quitYear: 2010,
		quitMonth: 5,
		quitDay: 2,
		amount: 1,
		cost: 4.5
		}
	*/

	// reference to the cookie
	this.cookieRef = new Mojo.Model.Cookie('_jdf_quitsmoking_');

	// try to get cookie and retrieve data
	this.cookieJSON = this.cookieRef.get();

	// if there is no data in the cookie...
	if (!this.cookieJSON) {
		// create a new quit date defaulted to today
		this.quittingDate = new Date();
		this.year = this.quittingDate.getFullYear();
		this.month = this.quittingDate.getMonth();
		this.day = this.quittingDate.getDate();

		// set amount default
		this.amount = 1;

		// set default cost
		this.cost = "5.00";
		
		// store defaults in a cookie
		this.dataChange();
	}

	// if there is already a cookie
	else {
		// set variables to hold the date information
		this.year = this.cookieJSON.quitYear;
		this.month = this.cookieJSON.quitMonth;
		this.day = this.cookieJSON.quitDay;
		this.amount = this.cookieJSON.amount;
		this.cost = this.cookieJSON.cost;

		// set the date to the stored date
		this.quittingDate = new Date(this.year, this.month, this.day);

		// get the stored amount
		this.amount = this.cookieJSON.amount;

		// get the stored cost
		this.cost = this.cookieJSON.cost;
	}


	// set up widgets
	this.controller.setupWidget("datePicker", {label: 'Quit Date'}, this.datePickerModel = {date: this.quittingDate});

	this.controller.setupWidget("amountSelector", {choices: [
							{label: "0.5", value: 0.5},
							{label: "1.0", value: 1},
							{label: "1.5", value: 1.5},
							{label: "2.0", value: 2},
							{label: "2.5", value: 2.5},
							{label: "3.0", value: 3},
							{label: "3.5", value: 3.5},
							{label: "4.0", value: 4},
							{label: "4.5", value: 4.5},
							{label: "5.0", value: 5}
							]},
							this.amountModel = {value: this.amount, disabled: false});
							
	this.controller.setupWidget("costText",
		{
			hintText: $L("5.00"),
            multiline: false,
            enterSubmits: false,
            autoFocus: false,
            modifierState: Mojo.Widget.numLock,
            changeOnKeyPress: true
         },
         this.costModel = {
             value: this.cost,
             disabled: false
         }
    );
    
    this.controller.setupWidget("saveButton", {}, {label : "Save Changes", disabled: false });

	// event listeners
	this.dataChange = this.dataChange.bind(this);
	
	// actual listeners set in activate()

};

PrefsAssistant.prototype.dataChange = function() {
	
	// when any data has changed, store the new data to the cookie

	this.year = this.quittingDate.getFullYear();
	this.month = this.quittingDate.getMonth();
	this.day = this.quittingDate.getDate();

	// if the cookie is reset and we're calling dataChange, this.amount is
	// already set, but this.amountModel is not and has no value,
	// so just ignore the listselector in this case
	if (this.amountModel) {
		this.amount = this.amountModel.value;
	}
	
	if (this.costModel) {
		this.cost = this.costModel.value;
	}

	this.cookieRef.put(
	 	{
		quitYear: this.year,
		quitMonth: this.month,
		quitDay: this.day,
		amount: this.amount,
		cost: this.cost
		});
}

PrefsAssistant.prototype.activate = function(event) {
	
	// set correct body class for background image
	this.controller.get("bodyTag").className = "prefsScene";
	
	Mojo.Event.listen(this.controller.get("datePicker"), Mojo.Event.propertyChange, this.dataChange);
	Mojo.Event.listen(this.controller.get("amountSelector"), Mojo.Event.propertyChange, this.dataChange);
	Mojo.Event.listen(this.controller.get("costText"), Mojo.Event.propertyChange, this.dataChange);
	Mojo.Event.listen(this.controller.get("saveButton"), Mojo.Event.tap, this.dataChange);
};

PrefsAssistant.prototype.deactivate = function(event) {
	Mojo.Event.stopListening(this.controller.get("datePicker"), Mojo.Event.propertyChange, this.dataChange);
	Mojo.Event.stopListening(this.controller.get("amountSelector"), Mojo.Event.propertyChange, this.dataChange);
	Mojo.Event.stopListening(this.controller.get("costText"), Mojo.Event.propertyChange, this.dataChange);
	Mojo.Event.stopListening(this.controller.get("saveButton"), Mojo.Event.tap, this.dataChange);
};

PrefsAssistant.prototype.cleanup = function(event) {
};

PrefsAssistant.prototype.handleCommand = function(event) {

	// handle drop-down menu commands

	this.controller = Mojo.Controller.stageController.activeScene();

	if(event.type == Mojo.Event.command) {	

		switch (event.command) {
			
			case "menu-help":
				this.controller.stageController.pushScene({name:"help"});
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

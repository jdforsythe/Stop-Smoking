function MainAssistant() {
}

MainAssistant.prototype.setup = function() {
	
	// create the drop-down menu
	this.appMenuModel = this.controller.setupWidget(Mojo.Menu.appMenu,
							{omitDefaultItems: true},

							{
								visible: true,
								items: [
										{ label: "Help", command: "menu-help"},
										{ label: "About", command: "menu-about"},
							    		{ label: "Preferences", command: "menu-prefs"}
								]
							});
							
	// listener for button taps
	this.buttonTap = this.buttonTap.bind(this);
	// listeners are set in activate

}

MainAssistant.prototype.activate = function(event) {
	
	// set correct body class for background image
	this.controller.get("bodyTag").className = "mainScene";
	
	// listen for button taps
	Mojo.Event.listen(this.controller.get("helpButton"), Mojo.Event.tap, this.buttonTap);
	Mojo.Event.listen(this.controller.get("oopsButton"), Mojo.Event.tap, this.buttonTap);
	Mojo.Event.listen(this.controller.get("prefsButton"), Mojo.Event.tap, this.buttonTap);
	
	// reload cookie data on activate
	// reference to the cookie
	this.cookieRef = new Mojo.Model.Cookie('_jdf_quitsmoking_');

	// try to get cookie and retrieve data
	this.cookieJSON = this.cookieRef.get();

	// if the cookie has data
	if (this.cookieJSON) {
				
		// set variables to hold the date information
		this.year = this.cookieJSON.quitYear;
		this.month = this.cookieJSON.quitMonth;
		this.day = this.cookieJSON.quitDay;
		this.amount = this.cookieJSON.amount;
		this.cost = this.cookieJSON.cost;

		// set the date objects
		this.quittingDate = new Date(this.year, this.month, this.day);
		// this.quittingDate = new Date(2010, 4, 1); // may 1, 2010
		this.todayDate = new Date();

		// determine the difference between the dates
		var dateDiff = this.parseDifference(this.quittingDate, this.todayDate);
		
		// get arrays of the parsed integers (e.g. 1234 = [1,2,3,4])
		var yearsParsed = this.parseDigits(dateDiff.years);
		var monthsParsed = this.parseDigits(dateDiff.months);
		var daysParsed = this.parseDigits(dateDiff.days);
		var cigsParsed = this.parseDigits( (dateDiff.total_days * this.amount * 20) );
		var costParsed = this.parseDigits( Math.round( (dateDiff.total_days * this.amount * this.cost) ) );	
	
	
	
		// prepend zeros to arrays so they're the expected amount of digits
		var yearsPadded = this.prependZeros(yearsParsed,2); // expected 2 digits
		var monthsPadded = this.prependZeros(monthsParsed,2); // expected 2 digits
		var daysPadded = this.prependZeros(daysParsed,2); // expected 2 digits
		var cigsPadded = this.prependZeros(cigsParsed,7); // expected 7 digits
		var costPadded = this.prependZeros(costParsed,7); // expected 7 digits
				
		// set year digits
		$("yearA").className = "num time " + this.getClass(yearsPadded[0]);
		$("yearB").className = "num time " + this.getClass(yearsPadded[1]);
		// set month digits
		$("monthA").className = "num time " + this.getClass(monthsPadded[0]);
		$("monthB").className = "num time " + this.getClass(monthsPadded[1]);
		// set day digits
		$("dayA").className = "num time " + this.getClass(daysPadded[0]);
		$("dayB").className = "num time " + this.getClass(daysPadded[1]);
	
		// set cigs digits
		$("cigsA").className = "num cigs " + this.getClass(cigsPadded[0]);
		$("cigsB").className = "num cigs " + this.getClass(cigsPadded[1]);
		$("cigsC").className = "num cigs " + this.getClass(cigsPadded[2]);
		$("cigsD").className = "num cigs " + this.getClass(cigsPadded[3]);
		$("cigsE").className = "num cigs " + this.getClass(cigsPadded[4]);
		$("cigsF").className = "num cigs " + this.getClass(cigsPadded[5]);
		$("cigsG").className = "num cigs " + this.getClass(cigsPadded[6]);
	
		// set cost digits
		$("savedA").className = "num saved " + this.getClass(costPadded[0]);
		$("savedB").className = "num saved " + this.getClass(costPadded[1]);
		$("savedC").className = "num saved " + this.getClass(costPadded[2]);
		$("savedD").className = "num saved " + this.getClass(costPadded[3]);
		$("savedE").className = "num saved " + this.getClass(costPadded[4]);
		$("savedF").className = "num saved " + this.getClass(costPadded[5]);
		$("savedG").className = "num saved " + this.getClass(costPadded[6]);
		
	}
	
	else {
		this.controller.stageController.pushScene({name:"prefs"});
	}

};

MainAssistant.prototype.getClass = function(num) {
				
	switch(num) {
		case 0: return "zero"; break;
		case 1: return "one"; break;
		case 2: return "two"; break;
		case 3: return "three"; break;
		case 4: return "four"; break;
		case 5: return "five"; break;
		case 6: return "six"; break;
		case 7: return "seven"; break;
		case 8: return "eight"; break;
		case 9: return "nine"; break;
	}
	
	return returnClass;
}

MainAssistant.prototype.parseDifference = function(oldDate,newDate) {
	var diff = newDate - oldDate;
	var num_years = Math.floor(diff / 31557600000); // milliseconds per year (1000*60*60*24*365.25)
	var num_months = Math.floor((diff % 31557600000) / 2629800000); // remainder after years factored out, divided by milliseconds per 1/12 year
	var num_days = Math.floor(((diff % 31557600000) % 2629800000)/86400000); // remainder after months factored out, divided by milliseconds per day
	var total_days = Math.floor(diff/86400000); // total number of days

	// factor leap days, for more human understandable results
	var leap_days = 0;

	for(var i=0; i<num_years; i++) {
		if ( ((oldDate.getFullYear()+i)%4) == 0) {
			leap_days++;
		}
	}

	num_days -= leap_days;

	// fix negative numbers from subtracting leap days
	if (num_days < 0) {
		num_months--;
		num_days += 30;

		if (num_months < 0) {
			num_years--;
			num_months += 12;
		}
	}
/*
needs work still, 2-28-2007 to 2-28-2008 = 0 years 11 months 30 days, should be 1 / 0 / 0
	
*/
	var diffObj = {"years": num_years, "months": num_months, "days": num_days, "total_days": total_days};

	return diffObj;
}

MainAssistant.prototype.parseDigits = function(num) {
	
	// returns the number of digits in the num integer
	var length = (num == 0) ? 1 : Math.floor((Math.log(num)/Math.LN10)) + 1;
	
	var parsed = [];
	var subtract = 0;
	
	for (var i=0; i < length; i++) {
		
		parsed[i] = Math.floor( (num-subtract) / Math.pow(10,(length-i-1)) );
		
		subtract += ( parsed[i] * Math.pow(10,(length-i-1)) );
		
	}
	
	return parsed;
}

MainAssistant.prototype.prependZeros = function(inArray, expectedLen) {
	
	var actualLen = inArray.length;
	
	if ( !(actualLen == expectedLen) ) {
		
		for(var i=0; i < expectedLen; i++) {
		
			if ( (actualLen-i-1) < 0 ) {
				inArray[expectedLen-i-1] = 0;
			}
		
			else {
				inArray[expectedLen-i-1] = inArray[actualLen-i-1];
			}
		
		}
		
	}
	
	return inArray;	
}

MainAssistant.prototype.buttonTap = function(event) {
	
	switch(event.target.id) {
		case "helpButton":
			// push help scene
			this.controller.stageController.pushScene({name:"help"});
		break;
		
		case "oopsButton":
			// delete the cookie
			this.cookieRef = new Mojo.Model.Cookie('_jdf_quitsmoking_');
			this.cookieRef.remove();
	
			// and push preferences scene (which defaults to today when there is no cookie)
			this.controller.stageController.pushScene({name:"prefs"});
		break;
		
		case "prefsButton":
			// push prefs scene
			this.controller.stageController.pushScene({name:"prefs"});
		break;
	}
		
}
	
MainAssistant.prototype.deactivate = function(event) {
		Mojo.Event.stopListening(this.controller.get("helpButton"), Mojo.Event.tap, this.buttonTap);
		Mojo.Event.stopListening(this.controller.get("oopsButton"), Mojo.Event.tap, this.buttonTap);
		Mojo.Event.stopListening(this.controller.get("prefsButton"), Mojo.Event.tap, this.buttonTap);
};

MainAssistant.prototype.cleanup = function(event) {
};


MainAssistant.prototype.handleCommand = function(event) {

	// handle drop-down menu commands

	this.controller = Mojo.Controller.stageController.activeScene();

	if(event.type == Mojo.Event.command) {	

		switch (event.command) {
			
			case "menu-help":
				this.controller.stageController.pushScene({name:"help"});
			break;

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

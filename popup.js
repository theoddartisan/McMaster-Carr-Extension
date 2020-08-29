window.addEventListener('load', function() {

	var homepage = ("https://www.mcmaster.com/");

	//Retrieve saved user settings from local storage
	chrome.storage.sync.get(['defaultFiletype', 'defaultLabeltype', 'homeToolselect', 'randomToolselect', 'searchToolselect', 'cadToolselect', 'labelToolselect', 'optionsToolselect'], function(item){
		if (item.homeToolselect == false) {document.getElementById('homearea').style.display="none"};
		if (item.randomToolselect == false) {document.getElementById('randomarea').style.display="none"};
		if (item.searchToolselect == false) {document.getElementById('searcharea').style.display="none"};
		if (item.cadToolselect == false) {document.getElementById('cadarea').style.display="none"};
		if (item.labelToolselect == false) {document.getElementById('labelarea').style.display="none"};
		if (item.optionsToolselect == false) {document.getElementById('optionsarea').style.display="none"};
	
		var temp = item.defaultFiletype;
		var mySelect = document.getElementById('filetype');
		for (var i, j = 0; i = mySelect.options[j]; j++) {
			if (i.value == temp) {
				mySelect.selectedIndex = j;
				break;
			};
		};

		var temp2 = item.defaultLabeltype;
		var mySelect2 = document.getElementById('labeltype');
		for (var i, j = 0; i = mySelect2.options[j]; j++) {
			if (i.value == temp2) {
				mySelect2.selectedIndex = j;
				break;
			};
		};
	});

	//Home button click action
	document.getElementById('homebutton').onclick = function() {
		mcmasterURLcheck(homepage);
	};

	//Random button click action
	document.getElementById('randombutton').onclick = function() {
		var randomURL = homepage+mcList[Math.floor(Math.random()*mcList.length)];
		mcmasterURLcheck(randomURL);
	};

	//Search input text bar action on hitting return
	document.getElementById('searchinput').onkeypress=function(e){
		if(e.keyCode==13){
			document.getElementById('searchbutton').click();
		}
	};
	//Search button click action
	document.getElementById('searchbutton').onclick = function() {
		var searchtext = document.getElementById('searchinput').value;
		var newsearchtext = searchtext.replace(/ /g, "-");
		var searchurl = homepage.concat(newsearchtext);
		mcmasterURLcheck(searchurl);
	};

	//CAD part number input text bar action on hitting return
	document.getElementById('cadinput').onkeypress=function(e){
		if(e.keyCode==13){
			document.getElementById('CADbutton').click();
		}
	};
	//Download CAD button click action
	document.getElementById('CADbutton').onclick = function() {
		var cadsearchtext = document.getElementById('cadinput').value;
		var filechoice = document.getElementById('filetype').options[document.getElementById('filetype').selectedIndex].text;
		if (cadsearchtext == '') {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {partnumberquery: "blankPartNum", query: "cad"}, function (response) {
											alert(response.backtopopup);

				if (response.backtopopup == "carryon") {	
						var labelPartNum = response.partNumber;
						chrome.runtime.sendMessage({bg: "cadbackground", filetype: filechoice, partlist: cadsearchtext}, function(response) {
						});
					};
				});
			});
		}
		else {
		chrome.runtime.sendMessage({bg: "cadbackground", filetype: filechoice, partlist: cadsearchtext}, function(response) {
		});
		};
	};

	//Label part number input text bar action on hitting return
	document.getElementById('labelinput').onkeypress=function(e){
		if(e.keyCode==13){
			document.getElementById('labelbutton').click();
		}
	};
	//Make Label button click action
	document.getElementById('labelbutton').onclick = function() {
		var labelPartNum = document.getElementById('labelinput').value;
		var labelchoice = document.getElementById('labeltype').options[document.getElementById('labeltype').selectedIndex].text;
		if (labelPartNum == '') {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {partnumberquery: "blankPartNum", query: "label"}, function (response) {
				if (response.backtopopup == "carryon") {	
						var labelPartNum = response.partNumber;
						chrome.runtime.sendMessage({bg: "labelmakertrigger", labelchoice: labelchoice, labelPartNum: labelPartNum}, function(response) {
						});
					};
				});
			});
		}
		else {
			chrome.runtime.sendMessage({bg: "labelmakertrigger", labelchoice: labelchoice, labelPartNum: labelPartNum}, function(response) {
			});
		};
	};

	//Settings button click action
	document.getElementById('options').onclick = function() {
	  if (chrome.runtime.openOptionsPage) {
		chrome.runtime.openOptionsPage();
	  } else {
		window.open(chrome.runtime.getURL('options.html'));
	  };
	};


});

//Check to see if current tab is already on a mcmaster.com website
function mcmasterURLcheck(destinationURL) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			var tabURL = tabs[0].url;
			var checkURL = "mcmaster.com";
			if (tabURL.search(checkURL)>-1) {
				chrome.tabs.update(tabs[0].id, {url: destinationURL});
			} else {
				window.open(destinationURL);
			}
	});
};


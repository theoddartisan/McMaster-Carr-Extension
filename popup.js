window.addEventListener('load', function() {
	//Format part detail information into table for copy function
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var tabURL = tabs[0].url;
		var checkURL = "mcmaster.com";
		if (tabURL.search(checkURL)>-1) {
			chrome.runtime.sendMessage({bg: "potrigger"}, function(response) {
				chrome.runtime.onMessage.addListener( function(request,sender,sendResponse) {
					if (request.poInfoReply == "poInfoReply") {
						var poPartNumber = request.poPartNumber;
						var poDescription = request.poDescription;
						var poUnitPrice = request.poUnitPrice;
						var poUnitQuantity = request.poUnitQuantity;
						if (poUnitQuantity.includes("per")) {
							poUnitQuantity = poUnitQuantity.substring(4);
						};
						var poPartURL = request.poPartURL;
						var cells1 = ["Part Number", "Description", "Unit Price", "Unit Quantity", "Part URL", "Blank Cell"];
						var cells2 = [poPartNumber, poDescription, poUnitPrice, poUnitQuantity, poPartURL, ""];
						chrome.storage.sync.get(['poPartNumRank', 'poDescriptionRank', 'poUnitPriceRank', 'poUnitQuantityRank', 'poPartURLRank', 'poBlankCellRank'], function(item){
							var ranks = [item.poPartNumRank-1, item.poDescriptionRank-1, item.poUnitPriceRank-1, item.poUnitQuantityRank-1, item.poPartURLRank-1, item.poBlankCellRank-1];					
							for (i=0; i<6; i++) {
								var checkDuplicates;
								if (getOccurrence(ranks, i) > 1) {
									checkDuplicates=true;
								};
								var checkValues = Array(6).fill(false);
								if (ranks[i] <= -1 || ranks[i] > 5 || isNaN(ranks[i])) {
									if (ranks[i] == "") {
										checkValues[i]=false;
									}
									else {
										checkValues[i]=true;
									};
								};
							};
							if (checkDuplicates == true) {
								var poerrorslot = document.getElementById('poError');
								poerrorslot.textContent = 'Error! Check settings for duplicate values in Purchase Order Table Elements list.';
								var tableDiv = document.getElementById('potables');
								document.getElementById('pobutton').disabled = true;
								tableDiv.textContent = '';
								sendResponse();
							}
							else if (checkValues == true) {
								var poerrorslot = document.getElementById('poError');
								poerrorslot.textContent = 'Error! Check settings for values in Purchase Order Table Elements list. All values must all be between 1 and 6.';
								var tableDiv = document.getElementById('potables');
								document.getElementById('pobutton').disabled = true;
								tableDiv.textContent = '';
								sendResponse();
							}
							else {
								for (i=0; i<6; i++) {
									if (ranks[i] == -1) {
									}
									else {
										document.getElementById('title'+ ranks[i].toString()).innerText = cells1[i];
										document.getElementById('content'+ranks[i].toString()).innerText = cells2[i];
									};
								};
								for (j=0; j<6; j++) {
									if (document.getElementById('title'+ j.toString()).innerText == "") {
										document.getElementById('title'+ j.toString()).remove();
										document.getElementById('content'+j.toString()).remove();
									};
								};
								sendResponse();
							};
						});
					}
					else if (request.poInfoReply == "specifySize") {
						var poerrorslot = document.getElementById('poError');
						poerrorslot.textContent = 'Specify Part Size Detail';
						var tableDiv = document.getElementById('potables');
						document.getElementById('pobutton').disabled = true;
						tableDiv.textContent = '';
						sendResponse();
					}
					else if (request.poInfoReply == "failed") {
						var poerrorslot = document.getElementById('poError');
						poerrorslot.textContent = 'Navigate to Product Detail Page';
						var tableDiv = document.getElementById('potables');
						tableDiv.textContent = '';
						document.getElementById('pobutton').disabled = true;
						sendResponse();
					};
				});
			});
		}
		else {
			var poerrorslot = document.getElementById('poError');
			poerrorslot.textContent = 'Navigate to Product Detail Page';
			var tableDiv = document.getElementById('potables');
			tableDiv.textContent = '';
			document.getElementById('pobutton').disabled = true;
		};
	});

	var homepage = ("https://www.mcmaster.com/");

	//Retrieve saved user settings from local storage
	chrome.storage.sync.get(['defaultFiletype', 'renameToolselect', 'autonameToolselect', 'defaultLabeltype', 'homeToolselect', 'randomToolselect', 'searchToolselect', 'cadToolselect', 'labelToolselect', 'poToolselect', /*'optionsToolselect',*/ 'poPartNumRank', 'poDescriptionRank', 'poUnitPriceRank', 'poUnitQuantityRank', 'poPartURLRank', 'poBlankCellRank'], function(item){
		if (item.homeToolselect == false) {document.getElementById('homearea').style.display="none"};
		if (item.randomToolselect == false) {document.getElementById('randomarea').style.display="none"};
		if (item.searchToolselect == false) {document.getElementById('searcharea').style.display="none"};
		if (item.cadToolselect == false) {document.getElementById('cadarea').style.display="none"};
		if (item.labelToolselect == false) {document.getElementById('labelarea').style.display="none"};
		if (item.poToolselect == false) {document.getElementById('purchaseOrderarea').style.display="none"};
		//if (item.optionsToolselect == false) {document.getElementById('optionsarea').style.display="none"};
		var renameToolselect = item.renameToolselect;
		var autonameToolselect = item.autonameToolselect;
	
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
				if (response.backtopopup == "carryon") {	
						var cadsearchtext = response.partNumber;
						chrome.runtime.sendMessage({bg: "cadbackground", filetype: filechoice, partlist: cadsearchtext});
					};
				});
			});
		}
		else {
		chrome.runtime.sendMessage({bg: "cadbackground", filetype: filechoice, partlist: cadsearchtext});
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

	//PO Order Information button click action
	document.getElementById('pobutton').onclick = function() {
		var clipboard = new ClipboardJS('.po');
		clipboard.on('success', function(e) {
			console.info('Action:', e.action);
			console.info('Text:', e.text);
			console.info('Trigger:', e.trigger);
			e.clearSelection();
			});
		clipboard.on('error', function(e) {
			console.error('Action:', e.action);
			console.error('Trigger:', e.trigger);
			});
        //Update status to let user know options were saved.
        var status = document.getElementById('pobutton');
        status.textContent = 'Copied to Clipboard';
        setTimeout(function() {status.textContent = 'Copy Part Information';}, 1000);
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

function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
};



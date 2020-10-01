window.onload = function(){
	chrome.runtime.onMessage.addListener( function(request,sender,sendResponse) {
		//Receive message from popup to start label making process
		if (request.bg == "labelmakertrigger") {
			sendResponse();
			var filechoice1=request.labelchoice;
			var partnum = request.labelPartNum;	
			var partURL = homepage+request.labelPartNum;
			if (partnum.search(',') != -1) {
				var partnumArray = partnum.split(',');					
				downloadLabelSequentially(partnumArray,filechoice1, () => console.log('done'));
			}
			else {
				labelUpdateCheck(partnum, filechoice1);
				chrome.tabs.create({url:partURL});
			};
		};

		//Receive message from popup to start CAD download process
		if (request.bg == "cadbackground") {
			filechoice1=request.filetype;
			partnum = request.partlist;
			var partURL = homepage+partnum;
			chrome.storage.sync.get(['autonameToolselect', 'slashReplacement', 'quoteReplacement', 'nameSubslist'], function(item){
				if (partnum.search(',') != -1) {
					var partnumArray = partnum.split(',');
					downloadCADSequentially(partnumArray,filechoice1, item.autonameToolselect, item.slashReplacement, item.quoteReplacement, item.nameSubslist, () => console.log('done'));
				}
				else {
					cadUpdateCheck(partnum, filechoice1, item.autonameToolselect, item.slashReplacement, item.quoteReplacement, item.nameSubslist);
					chrome.tabs.create({url:partURL});
				};
			});
		};

		//Receive message from popup to start generating part detail table for purchase order
		if (request.bg == "potrigger") {
			sendResponse();
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {poInfoRequest: "poInfo"}, function potrigger(response) {
					if (response.partDetailCheck == "failed") {
					chrome.runtime.sendMessage({poInfoReply:"failed"}, function(response) {
						});
					}
					else if (response.partDetailCheck == "specifySize") {
						chrome.runtime.sendMessage({poInfoReply:"specifySize"}, function(response) {
							});
					}
					else {
						var poPartNumber = response.poPartNumber;
						var poDescription = response.poDescription;
						var poUnitPrice = response.poUnitPrice;
						var poUnitQuantity = response.poUnitQuantity;
						var poPartURL = tabs[0].url;
						chrome.runtime.sendMessage({poInfoReply:"poInfoReply", poPartNumber:poPartNumber, poDescription:poDescription, poUnitPrice:poUnitPrice, poUnitQuantity:poUnitQuantity, poPartURL:poPartURL}, function(response) {
						});
					};
				});
			});
		};
	});
};

var homepage = ("https://www.mcmaster.com/");

function labelMaker (response, filechoice) {
	if (response.next == "screenshot") {
		var labelProperties = [
			//height, width, include image?, horizontal or vertical layout?, swap image for QR code?
			[0.5, 1.75, false, true, false],
			[1, 2.625, false, true, false],
			[1, 4, false, true, false],
			[2, 4, true, true, false],
			[2, 4, true, true, true],
			[3.3125, 4, true, false, false],
			[0.75, 2.5, false, true, false],
			[1, 1, false, true, false],
			[1, 1, false, "qronly", false],
			[1, 3.5, false, true, false],
			[1.125, 3.5, false, true, false],
			[2.125, 4, true, true, false],
			[2.125, 4, true, true, true],
			[2.3125, 4, true, true, false],
			[2.3125, 4, true, true, true],
			[4, 6, true, false]
		];
		var labelArray = ['1/2" x 1 3/4"', '1" x 2 5/8"', '1" x 4"', '2" x 4" Image', '2" x 4" QR Code', '3 5/16" by 4"', '3/4" x 2 1/2"', '1" x 1" Text', '1" x 1" QR Code', '1" x 3 1/2"', '1 1/8" x 3 1/2"', '2 1/8" x 4" Image','2 1/8" x 4" QR Code', '2 5/16" x 4" Image','2 5/16" x 4" QR Code', '4" x 6"'];
		var labelHeight = labelProperties[labelArray.indexOf(filechoice)][0];
		var labelWidth = labelProperties[labelArray.indexOf(filechoice)][1];
		var lineHeight = labelHeight/6*72;
		var fontSize;
		if (labelWidth <= 1) {
			fontSize = 8;
			lineHeight = fontSize;
		}
		else if (labelWidth <= 3) {
			fontSize = lineHeight;
		}
		else if (labelWidth <= 4 && labelHeight <=3) {
			fontSize = 14;
			lineHeight = fontSize;
		}
		else {
			lineHeight = labelHeight/6*72*0.4;
			fontSize = lineHeight;
		};
		var styleSheet = `<style>
			body {
				padding: 0px;
				margin: 0px;
				width: ` + labelWidth + `in;
				height: ` + labelHeight + `in
			}

			.right {
				height:100%;
				line-height:` + lineHeight + `pt;
				max-height: ` + labelHeight + `in;
				font-size: ` + fontSize + `pt;
				font-family: Arial, Helvetica, sans-serif;
				word-wrap: break-word;
				overflow:hidden;
				display: table-cell;
			}

			.skinnylabel {
				height:100%;
				width: 100%;
				line-height:` + lineHeight + `pt;
				max-height: ` + labelHeight + `in;
				overflow:hidden;
				display: table;
				
			}

			p {
				padding: 0;
				margin: 0;
				display: table-cell;
				vertical-align: middle;
				font-size: ` + fontSize + `pt;
				font-family: Arial, Helvetica, sans-serif;
				word-wrap: break-word;
				text-align: center;
			}

			.horizontalImg {
				max-height: `+ labelHeight + `in;
				max-width: ` + (labelWidth*.5) + `in;
				width: auto;
				height: auto;
			}

			.horizontal {
				display: grid;
				grid-template-columns: 50% 50%;
				grid-template-rows: ` + labelHeight + `in;
				align-content: center;
				align-items: center;
				justify-items: center;
			}

			.grid-item {
				text-align: center;
				object-fit: contain;
			}

			.vertical {
				display: grid;
				grid-template-columns: auto auto;
				grid-template-rows: `+ (labelHeight*.6) + `in `+ (labelHeight*.4) + `in;
				align-content: center;
				align-items: center;
				justify-items: center;

			}

			.verticalImg {
				max-height: `+ (labelHeight*.6) + `in;
				max-width: ` + (labelWidth*.5) + `in;
				width: auto;
				height: auto;
			}

			.item3 {
				grid-column: 1/3;
			}
			</style>`;
		var mywindow = window.open('', 'Label', 'height=50,width=200');
		mywindow.document.write('<html><head>' +styleSheet + '</head><body >');

		//vertical layout, includes image and QR code
		if (labelProperties[labelArray.indexOf(filechoice)][3] == false) {
			mywindow.document.write(`
			<div class="grid-container vertical">
				<div class="grid-item item1"><img class="verticalImg" src=` + response.partImage + `></div>
				<div class="grid-item item2"><div class="qr" id="qrcode"></div></div>
				<div class="grid-item item3"><div class='right' id='textside'><p><b>` + response.mainTitle + `</b><br>` + response.subTitle + `<br><i>McMaster Part: `+ response.partNum +`</i></p></div></div>
			`);
			var qrcode = new QRCode(mywindow.document.getElementById("qrcode"), {text: "https://www.mcmaster.com/"+response.partNum, width: 120, height: 120});
		}
		//QR code only for 1" by 1" label
		else if (labelProperties[labelArray.indexOf(filechoice)][3] == "qronly") {
			mywindow.document.write(`
			<div><div class="qr" id="qrcode"></div>
			`);
			var qrcode = new QRCode(mywindow.document.getElementById("qrcode"), {text: "https://www.mcmaster.com/"+response.partNum, width: 90, height: 90});
		}
		//Horizontal layout for labels that are large enough to include image or QR code
		else if (labelProperties[labelArray.indexOf(filechoice)][2] == true) {
			if (labelProperties[labelArray.indexOf(filechoice)][4] == false) {
				mywindow.document.write(`
				<div class="grid-container horizontal">
				<div class='grid-item'><img class="horizontalImg" src=` + response.partImage + `></div>
				<div class='grid-item'><div class='right' id='textside'><p><b>` + response.mainTitle + `</b><br>` + response.subTitle + `<br><i>McMaster Part: `+ response.partNum +`</i></p></div></div>
				`);
			}
			else if (labelProperties[labelArray.indexOf(filechoice)][4] == true) {
				mywindow.document.write(`
				<div class="grid-container horizontal">
				<div class='grid-item item1'><div class="horizontalImg" id="qrcode"></div></div>
				<div class='grid-item item2'><div class='right' id='textside'><p><b>` + response.mainTitle + `</b><br>` + response.subTitle + `<br><i>McMaster Part: `+ response.partNum +`</i></p></div></div>
				`);
				var qrcode = new QRCode(mywindow.document.getElementById("qrcode"), {text: "https://www.mcmaster.com/"+response.partNum, width: 140, height: 140});
			}
		}
		else {
		mywindow.document.write(`
			<div class='skinnylabel' id='textside' ><p><b>` + response.mainTitle + `</b><br>` + response.subTitle + `<br><i>McMaster Part: `+ response.partNum +`</i></p>`
			);
		};
    	mywindow.document.write('</div></body></html>');
		html2canvas(mywindow.document.body, {scrollX:0, scrollY: -window.scrollY, dpi: 300, scale:2, allowTaint: true}).then( function (canvas) {
			mywindow.close();
			labelName = response.partNum +'_' +labelHeight+'x'+labelWidth+'_label.png';
			saveAs(canvas.toDataURL(), labelName);
		});			
	};
};

function cadUpdateCheck(partnum, filechoice, autonameToolselect, slashReplacement, quoteReplacement, nameSubslist) {
	chrome.webNavigation.onHistoryStateUpdated.addListener(function cadupdate(tabId, info) {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {command: "runDownload", filetype1: filechoice}, function rundownloadlistener(response) {
				if (response.wrapup == "invalidcad") {
					alert("Invalid Part Number. Try again.");
					chrome.tabs.remove(tabs[0].id);
					chrome.webNavigation.onHistoryStateUpdated.removeListener(cadupdate);
				}	
				else if (response.wrapup == "prepared") {
					var newfilename = response.newfilename;
					var conflictAct = "uniquify";
					if (autonameToolselect == true) {
						if (newfilename.search("/") != -1) {
							newfilename = newfilename.replace(/\//g, slashReplacement);
						};
						if (newfilename.search('"') != -1) {
							newfilename = newfilename.replace(/"/g, quoteReplacement);
						};
						var nameSubslistArray = nameSubslist.split(';');
						var splitNamelist;
						for (i=0; i<nameSubslistArray.length-1; i++) {
							splitNamelist = nameSubslistArray[i].split('=');
							newfilename = newfilename.replace(RegExp(splitNamelist[0], 'gi'), splitNamelist[1]);
						}
						if (newfilename.search(', ') != -1) {
							newfilename = newfilename.replace(/ ,/g, ',');
						};
						if (newfilename[0] == ' ') {
							newfilename = newfilename.substring(1);
						};
					};
					chrome.downloads.onDeterminingFilename.addListener(function namechange(item, __suggest) {
						function suggest(filename, conflictAction) {
							__suggest({filename: filename,
							conflictAction: conflictAction,
							conflict_action: conflictAction});
						};
						if (autonameToolselect != true) {
							newfilename = item.filename;					
						};
						suggest(newfilename, conflictAct);
						chrome.downloads.onDeterminingFilename.removeListener(namechange);
						chrome.webNavigation.onHistoryStateUpdated.removeListener(cadupdate);
						console.log(newfilename);
					});
					chrome.tabs.sendMessage(tabs[0].id, {command: "downloadstart"}, function startdownload(response) {
					});
				};
			});
		});
	});
};

function labelUpdateCheck(partnum, filechoice, callback) {
	chrome.webNavigation.onHistoryStateUpdated.addListener(function labelupdate(tabId, info) {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {command: "makelabel", labeltype1: filechoice}, function (response) {
				if (response.invalid == "invalid") {
					alert("Invalid Part Number. Try again.");
					chrome.tabs.remove(tabs[0].id);
					chrome.webNavigation.onHistoryStateUpdated.removeListener(labelupdate);
				}
				else {
				labelMaker(response, filechoice);
				chrome.tabs.remove(tabs[0].id);
				chrome.webNavigation.onHistoryStateUpdated.removeListener(labelupdate);
				};
			});
		});		
	});
};

function saveAs(uri, filename) {
	var link = document.createElement('a');
	if (typeof link.download === 'string') {
		link.href = uri;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	} else {
		window.open(uri);
	};
};

function mcmasterURLcheck(destinationURL) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			var tabURL = tabs[0].url;
			var checkURL = "mcmaster.com";
			if (tabURL.search(checkURL)>-1) {
				chrome.tabs.update(tabs[0].id, {url: destinationURL});
			} else {
				chrome.tabs.create({url:destinationURL});
			}
	});
};


function downloadCADSequentially(urls, filechoice, autoname, slash, quote, substring, callback) {
  let index = 0;
  let currentId;
  chrome.downloads.onChanged.addListener(onChanged);
  next(filechoice, autoname, slash, quote, substring);

  function next() {
    if (index >= urls.length) {
      chrome.downloads.onChanged.removeListener(onChanged);
      callback();
      return;
    }
    const url = homepage + urls[index];
    index++;

	cadUpdateCheck(urls[index], filechoice, autoname, slash, quote, substring);
	chrome.tabs.create({url:url});
  }

  function onChanged({id, state}) {
    if (state && state.current !== 'in_progress') {
      next();
    }
  }
};

function downloadLabelSequentially(urls, filechoice, callback) {
  let index = 0;
  let currentId;
  chrome.downloads.onChanged.addListener(onChanged);
  next(filechoice);

  function next() {
    if (index >= urls.length) {
      chrome.downloads.onChanged.removeListener(onChanged);
      callback();
      return;
    }
    const url = homepage + urls[index];
    index++;

	labelUpdateCheck(url, filechoice);
	chrome.tabs.create({url:url});
  }

  function onChanged({id, state}) {
    if (state && state.current !== 'in_progress') {
      next();
    }
  }
};
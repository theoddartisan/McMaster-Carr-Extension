window.onload = function(){
	chrome.runtime.onMessage.addListener( function(request,sender,sendResponse) {
		if (request.bg == "labelmakertrigger") {
			sendResponse();
			var filechoice1=request.labelchoice;
			var partnum = request.labelPartNum;	
			var partURL = homepage+request.labelPartNum;
			labelUpdateCheck(partnum, filechoice1);
			chrome.tabs.create({url:partURL});			
		};

		if (request.bg == "cadbackground") {
			filechoice1=request.filetype;
			partnum = request.partlist;
			var partURL = homepage+partnum;
			cadUpdateCheck(partnum, filechoice1);
			chrome.tabs.create({url:partURL});
		};
	});
};

var homepage = ("https://www.mcmaster.com/");

function labelMaker (response, filechoice) {
	
	if (response.next == "screenshot") {
		var labelProperties = [
			//height, width, include image?, horizontal or vertical layout?
			[0.5, 1.75, false, true],
			[1, 2.625, false, true],
			[1, 4, false, true],
			[2, 4, true, true],
			[3.3125, 4, true, false],
			[0.75, 2.5, false, true],
			[1, 1, false, true],
			[1, 3.5, false, true],
			[1.125, 3.5, false, true],
			[2.125, 4, true, true],
			[2.25, 4, true, true],
			[2.3125, 4, true, true],
			[4, 6, true, false]
		];
		var labelArray = ['1/2" x 1 3/4"', '1" x 2 5/8"', '1" x 4"', '2" x 4"', '3 5/16" by 4"', '3/4" x 2 1/2"', '1" x 1"', '1" x 3 1/2"', '1 1/8" x 3 1/2"', '2 1/8" x 4"', '2 1/4" x 4"', '2 5/16" x 4"', '4" x 6"'];
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

		if (labelProperties[labelArray.indexOf(filechoice)][3] == false) {
			mywindow.document.write(`
			<div class="grid-container vertical">
				<div class="grid-item item1"><img class="verticalImg" src=` + response.partImage + `></div>
				<div class="grid-item item2"><div class="qr" id="qrcode"></div></div>
				<div class="grid-item item3"><div class='right' id='textside'><p><b>` + response.mainTitle + `</b><br>` + response.subTitle + `<br><i>McMaster Part: `+ response.partNum +`</i></p></div></div>
			`);
			var qrcode = new QRCode(mywindow.document.getElementById("qrcode"), {text: "https://www.mcmaster.com/"+response.partNum, width: 120, height: 120});
		}
		else if (labelProperties[labelArray.indexOf(filechoice)][2] == true) {
			mywindow.document.write(`
			<div class="grid-container horizontal">
			<div class='grid-item'><img class="horizontalImg" src=` + response.partImage + `></div>
			<div class='grid-item'><div class='right' id='textside'><p><b>` + response.mainTitle + `</b><br>` + response.subTitle + `<br><i>McMaster Part: `+ response.partNum +`</i></p></div></div>
		`);
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

function cadUpdateCheck(partnum, filechoice) {
	chrome.webNavigation.onHistoryStateUpdated.addListener(function cadupdate(tabId, info) {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {command: "runDownload", filetype1: filechoice}, function rundownloadlistener(response) {
				if (response.end == "invalidcad") {
					alert("Invalid Part Number. Try again.");
					chrome.tabs.remove(tabs[0].id);
					chrome.webNavigation.onHistoryStateUpdated.removeListener(cadupdate);
					chrome.webNavigation.onHistoryStateUpdated.removeListener(rundownloadlistener);
				}	
				else if (response.end == "finished") {
					console.log("finished");
					chrome.webNavigation.onHistoryStateUpdated.removeListener(cadupdate);
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



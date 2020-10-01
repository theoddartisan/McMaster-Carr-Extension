chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    //Collect part detail information from page and send to background
    if (request.poInfoRequest == "poInfo") {
        if (document.getElementsByClassName("bk attrComp").length == 0) {
            sendResponse({partDetailCheck: "failed"});
        }
        else if (document.getElementsByClassName("PrceTxt")[0].innerText == "" || document.getElementsByClassName("mg mp mr ng ni spec-search--value").length > 1) {
            sendResponse({partDetailCheck: "specifySize"});
        }
        else {
            var poPartNumber = document.getElementsByClassName("bk attrComp")[0].innerText;
            var mainTitle = document.getElementsByClassName("header-primary--pd")[0].innerText;
            if (document.getElementsByClassName("header-secondary--pd")[0] == null) {
                subTitle = "";
            }
            else {
                var subTitle = document.getElementsByClassName("header-secondary--pd")[0].innerText;
            };
		    var poDescription = mainTitle + " " + subTitle;
            var priceLine = document.getElementsByClassName("PrceTxt")[0].innerText;
		    var poUnitPrice = priceLine.substr(0, priceLine.indexOf(" "));
            if (document.getElementsByClassName("am eto--specs").length > 0) {
                var poUnitQuantity = priceLine.substr(priceLine.indexOf(" ")+1) + ", [" + document.getElementsByClassName("mg mp mr ng ni spec-search--slctd spec-search--value")[0].innerText + "] "+ document.getElementsByClassName("AttrNm_Lbl Hide")[0].innerText;
            }
            else {
		        var poUnitQuantity = priceLine.substr(priceLine.indexOf(" ")+1);
            };
            sendResponse({partDetailCheck: null,poPartNumber:poPartNumber, poDescription:poDescription, poUnitPrice:poUnitPrice, poUnitQuantity:poUnitQuantity});
        };
    };    

    //Collect part number from part detail page if popup tool was activated with no value
    if (request.partnumberquery == "blankPartNum") {
        if (document.getElementsByClassName("bk attrComp").length == 0) {
            alert("Enter a Part Number or navigate to a Product Detail page and click again");                
            sendResponse({backtopopup: "wrong page"});
        }
        else if (request.query == "cad") {
            if (location.href.search('-') != -1) {
                partNumber = location.href.slice(location.href.indexOf('-')+1, location.href.length-1);
            }
            else {
            partNumber = document.getElementsByClassName("bk attrComp")[0].innerText;
            };
            isthereCAD = document.getElementsByClassName("button-save--stacked button-tertiary--cad HideOnItmPrint save-cad").length;
            if (isthereCAD >0) {
            sendResponse({backtopopup: "carryon", partNumber:partNumber});
            }
            else {
                alert("This part does not have CAD available.");
                sendResponse();
            };
        }
        else if (request.query == "label") {
            partNumber = document.getElementsByClassName("bk attrComp")[0].innerText;
            sendResponse({backtopopup: "carryon", partNumber:partNumber});
        }
    };
    
    //Collect part information for creating labels
    if (request.command == "makelabel") {
        if (document.getElementsByClassName("WarningTxt").length > 0 || document.getElementsByClassName("jg jl").length > 0) {
            sendResponse({invalid: "invalid"});
        }
        else {
		    var mainTitle = document.getElementsByClassName("header-primary--pd")[0].innerText;
            if (document.getElementsByClassName("header-secondary--pd")[0] == null) {
                subTitle = "";
            }
            else {
                var subTitle = document.getElementsByClassName("header-secondary--pd")[0].innerText;
            };
            if (subTitle.length > 70) { subTitle=subTitle.substring(0, 70)};
            var partImagesArray = document.getElementsByClassName("aj ImgCaptionCntnrHover");
            var partImage1 = partImagesArray[0];
            for (i=1; i<partImagesArray.length; i++) {
                if (partImagesArray[i].clientHeight > partImage1.clientHeight) {
                    partImage1 = partImagesArray[i];
                };
            };
            var partImage = partImage1.firstElementChild.src;
            var partNum = document.getElementsByClassName("bk attrComp")[0].innerText;
            sendResponse({next:'screenshot', mainTitle: mainTitle, subTitle:subTitle, partImage:partImage, partNum:partNum});
        };
    };
    
    //Wait for command from background to start the CAD file download
    if (request.command == "downloadstart") {
        var savefile = document.getElementsByClassName("button-save--stacked button-tertiary--cad HideOnItmPrint save-cad")[0];
        setTimeout(function() {savefile.click();}, 100);
        sendResponse();    
    };

    //Edit html of part detail page to prepare for CAD download, gather part information for CAD download
    if (request.command == "runDownload") {  
        var fileformat = request.filetype1;
        if (document.getElementsByClassName("WarningTxt").length > 0 || document.getElementsByClassName("jg jl").length > 0) {
            sendResponse({wrapup: "invalidcad"});
        }
        else if (document.getElementsByClassName("button-save--stacked button-tertiary--cad HideOnItmPrint save-cad").length !== 1) {
            alert("This part does not have CAD available.");
            sendResponse();
        }
        else {
            //eliminate the CAD option that is selected by default based on user's past CAD download selection
            var i;
            for (i = 0; i<document.getElementsByClassName("li--cad li-cad--slctd").length; i++) {
                document.getElementsByClassName("li--cad li-cad--slctd")[0].className = "li--cad";
            };


            //identify appropriate element that corresponds with desired file format
            var x;
            var myArray = new Array(document.getElementsByClassName("li--cad").length);
            for (x=0; x<document.getElementsByClassName("li--cad").length; x++) {
                myArray[x] = document.getElementsByClassName("li--cad")[x].innerText.search(fileformat);
            };

            //append classname to appropriate array elements for selected download format
            var y;
            for (y=0; y<myArray.length; y++) {
                if (myArray[y] > -1) {
                    document.getElementsByClassName("li--cad")[y].className += " li-cad--slctd";
                };
            };

            //Collect information for renaming the CAD file
            var partNumber = document.getElementsByClassName("bk attrComp")[0].innerText;
            var mainTitle = document.getElementsByClassName("header-primary--pd")[0].innerText;
            if (document.getElementsByClassName("header-secondary--pd")[0] == null) {
                subTitle = "";
            }
            else {
                var subTitle = document.getElementsByClassName("header-secondary--pd")[0].innerText;
            };
            var fileformatArray = ["3-D EDRW", "3-D IGES", "3-D SAT", "3-D Solidworks", "3-D STEP", "2-D DWG", "2-D DXF", "2-D Solidworks"];
            var fileExtensionArray = [".edrw", ".igs", ".sat", ".sldprt", ".step", ".dwg", ".dxf", ".slddrw"];
            var fileExtension = fileExtensionArray[fileformatArray.indexOf(fileformat)];
            var renamedFile = mainTitle + " " + subTitle + ", Part " + partNumber +  fileExtension;
            sendResponse({wrapup: "prepared", newfilename: renamedFile});      
        };
    };    
});

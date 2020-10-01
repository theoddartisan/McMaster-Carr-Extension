//Saves options to chrome.storage

function save_options(whichStatus) {
    //User selection for parts of extension to be visible in popup
    var defaultFiletype = document.getElementById('filetype').value;
    var autonameToolselect = document.getElementById('renameAuto').checked;
    var slashReplacement = document.getElementById('slashSub').value;
    var quoteReplacement = document.getElementById('quoteSub').value;
    var nameSubslist = document.getElementById('stringSub').value;
    var defaultLabeltype = document.getElementById('labeltype').value;
    var homeToolselect = document.getElementById('homeTool').checked;
    var randomToolselect = document.getElementById('randomTool').checked;
    var searchToolselect = document.getElementById('searchTool').checked;
    var cadToolselect = document.getElementById('cadTool').checked;
    var labelToolselect = document.getElementById('labelTool').checked;
    var poToolselect = document.getElementById('poTool').checked;
    var poPartNumRank = document.getElementById('poPartNumTool').value;
    var poDescriptionRank = document.getElementById('poDescriptionTool').value;
    var poUnitPriceRank = document.getElementById('poUnitPriceTool').value;
    var poUnitQuantityRank = document.getElementById('poUnitQuantityTool').value;
    var poPartURLRank = document.getElementById('poPartURLTool').value;
    var poBlankCellRank = document.getElementById('poBlankTool').value;

    //Store selections when user hits the Save button
    chrome.storage.sync.set({
        defaultFiletype: defaultFiletype,
        autonameToolselect: autonameToolselect,
        slashReplacement: slashReplacement,
        quoteReplacement: quoteReplacement,
        nameSubslist: nameSubslist,
        defaultLabeltype: defaultLabeltype,
        homeToolselect: homeToolselect,
        randomToolselect: randomToolselect,
        searchToolselect: searchToolselect,
        cadToolselect: cadToolselect,
        labelToolselect: labelToolselect,
        poToolselect: poToolselect,
        poPartNumRank: poPartNumRank,
        poDescriptionRank: poDescriptionRank,
        poUnitPriceRank: poUnitPriceRank,
        poUnitQuantityRank: poUnitQuantityRank,
        poPartURLRank: poPartURLRank,
        poBlankCellRank: poBlankCellRank
        }, function() {
        //Update status to let user know options were saved.
        if (whichStatus == 1) {
        var status1 = document.getElementById('status1');
        status1.textContent = 'Options saved.';
        setTimeout(function() {status1.textContent = '';}, 750);
        }
        else if (whichStatus == 2) {
        var status2 = document.getElementById('status2');
        status2.textContent = 'Options saved.';
        setTimeout(function() {status2.textContent = '';}, 750);
        };
    });
};

// Restores select box and checkbox state using the preferences stored in chrome.storage.
function restore_options() {
  // Use default values
  chrome.storage.sync.get({
    defaultFiletype: '3-D EDRW',
    autonameToolselect: false,
    slashReplacement: '[',
    quoteReplacement: 'in',
    nameSubslist: '',
    defaultLabeltype: '1/2" x 1 3/4"',
    homeToolselect: true,
    randomToolselect: true,
    searchToolselect: true,
    cadToolselect: true,
    labelToolselect: true,
    poToolselect: true,
    poPartNumRank: '',
    poDescriptionRank: '',
    poUnitPriceRank: '',
    poUnitQuantityRank: '',
    poPartURLRank: '',
    poBlankCellRank: ''
    }, function(items) {
    document.getElementById('filetype').value = items.defaultFiletype;
    document.getElementById('renameAuto').checked = items.autonameToolselect;
    document.getElementById('slashSub').value = items.slashReplacement;
    document.getElementById('quoteSub').value = items.quoteReplacement;
    document.getElementById('stringSub').value = items.nameSubslist;
    document.getElementById('labeltype').value = items.defaultLabeltype;
    document.getElementById('homeTool').checked = items.homeToolselect;
    document.getElementById('randomTool').checked = items.randomToolselect;
    document.getElementById('searchTool').checked = items.searchToolselect;
    document.getElementById('cadTool').checked = items.cadToolselect;
    document.getElementById('labelTool').checked = items.labelToolselect;
    document.getElementById('poTool').checked = items.poToolselect;
    document.getElementById('poPartNumTool').value = items.poPartNumRank;
    document.getElementById('poDescriptionTool').value = items.poDescriptionRank;
    document.getElementById('poUnitPriceTool').value = items.poUnitPriceRank
    document.getElementById('poUnitQuantityTool').value = items.poUnitQuantityRank;
    document.getElementById('poPartURLTool').value = items.poPartURLRank;
    document.getElementById('poBlankTool').value = items.poBlankCellRank;
  });
};

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

document.addEventListener('DOMContentLoaded', restore_options);

document.getElementById('save1').onclick = function() {
    save_options(1);
};
document.getElementById('save2').onclick = function() {
    save_options(2);
};

document.getElementById('cadnamesave').onclick = function() {
	download("McMasterCarrExtension_CADFilenameSettings.txt", document.getElementById('stringSub').value);
};
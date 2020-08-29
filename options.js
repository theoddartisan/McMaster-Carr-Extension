//Saves options to chrome.storage

function save_options() {
    //User selection for parts of extension to be visible in popup
    var defaultFiletype = document.getElementById('filetype').value;
    var defaultLabeltype = document.getElementById('labeltype').value;
    var homeToolselect = document.getElementById('homeTool').checked;
    var randomToolselect = document.getElementById('randomTool').checked;
    var searchToolselect = document.getElementById('searchTool').checked;
    var cadToolselect = document.getElementById('cadTool').checked;
    var labelToolselect = document.getElementById('labelTool').checked;
    var optionsToolselect = document.getElementById('optionsTool').checked;

    //Store selections when user hits the Save button
    chrome.storage.sync.set({
        defaultFiletype: defaultFiletype,
        defaultLabeltype: defaultLabeltype,
        homeToolselect: homeToolselect,
        randomToolselect: randomToolselect,
        searchToolselect: searchToolselect,
        cadToolselect: cadToolselect,
        labelToolselect: labelToolselect,
        optionsToolselect: optionsToolselect
        }, function() {
        //Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {status.textContent = '';}, 750);
    });
};

// Restores select box and checkbox state using the preferences stored in chrome.storage.
function restore_options() {
  // Use default values
  chrome.storage.sync.get({
    defaultFiletype: '3-D EDRW',
    defaultLabeltype: '1/2" x 1 3/4"',
    homeToolselect: true,
    randomToolselect: true,
    searchToolselect: true,
    cadToolselect: true,
    labelToolselect: true,
    optionsToolselect: true
    }, function(items) {
    document.getElementById('filetype').value = items.defaultFiletype;
    document.getElementById('labeltype').value = items.defaultLabeltype;
    document.getElementById('homeTool').checked = items.homeToolselect;
    document.getElementById('randomTool').checked = items.randomToolselect;
    document.getElementById('searchTool').checked = items.searchToolselect;
    document.getElementById('cadTool').checked = items.cadToolselect;
    document.getElementById('labelTool').checked = items.labelToolselect;
    document.getElementById('optionsTool').checked = items.optionsToolselect;
  });
};

document.addEventListener('DOMContentLoaded', restore_options);

document.getElementById('save').addEventListener('click', save_options);
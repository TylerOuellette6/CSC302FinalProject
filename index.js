var edgeData = localStorage.getItem('edgeData');
var nodeData = localStorage.getItem('nodeData');
var headers = localStorage.getItem('headers');

var sourceData = localStorage.getItem('source');
var targetData = localStorage.getItem('target');

var headerSetting = localStorage.getItem('headerSetting');
var graphTypeSetting = localStorage.getItem('graphTypeSetting');
var mergeTypeSetting = localStorage.getItem('mergeTypeSetting');

var sourceHeader = null;
var targetHeader = null;

$(document).ready(function(){
    localStorage.clear();
    $("#data_page").hide();

    $(document).on('click', "#create-tables", createTables)
    $(document).on('click', "#return-to-uploads", returnToUploads)

    document.getElementById('upload-edge-file').addEventListener('change', handleEdgeFileUpload, false)
    document.getElementById('upload-node-file').addEventListener('change', handleNodeFileUpload, false)

    document.getElementById('header-yes').addEventListener('change', handleHeaderYes, false)
    document.getElementById('header-no').addEventListener('change', handleHeaderNo, false)
    document.getElementById('graph-undirected').addEventListener('change', handleGraphUndirected, false)
    document.getElementById('graph-directed').addEventListener('change', handleGraphDirected, false)
    document.getElementById('merge-sum').addEventListener('change', handleMergeSum, false)
    document.getElementById('merge-dontmerge').addEventListener('change', handleMergeDontMerge, false)

});

var handleHeaderYes = function(event){
    var fileName = document.getElementById('upload-edge-file').files[0].name;
    var fileType = fileName.slice(-3);
    // console.log(fileName);
    // console.log(fileType);
    if(fileType === "tsv"){
        var newEdgeData = edgeData.replace(/\t/g, ",");
        localStorage.setItem('edgeData', newEdgeData);
        edgeData = localStorage.getItem('edgeData');
    }

    localStorage.setItem('headerSetting', 'yes');

    var allDataArray = edgeData.split("\n");
    var justHeaders = allDataArray[0].split(",");
    for(var i=0; i<justHeaders.length; i++){justHeaders[i] = justHeaders[i].replace(/\s+/g, '');}
    localStorage.setItem('headers', justHeaders);

    var sourceSelection = document.getElementById("source-selection");
    var targetSelection = document.getElementById("target-selection");

    var sourceh5 = document.createElement("h5");
    sourceh5.innerHTML = "Source: ";
    sourceh5.setAttribute("id", "sourceh5");
    sourceSelection.appendChild(sourceh5);

    var targeth5 = document.createElement("h5");
    targeth5.innerHTML = "Target: ";
    targeth5.setAttribute("id", "targeth5");
    targetSelection.appendChild(targeth5);

    radioButtonMaker = function($vertex, $headerText, $divElement){
        var radioButton = document.createElement("input");
        radioButton.setAttribute("type", "radio");
        radioButton.setAttribute("id", $vertex + "-" + $headerText);
        radioButton.setAttribute("class", "radio");

        var radioButtonText = document.createElement("label");
        radioButtonText.setAttribute("id", $vertex + "-" + $headerText + "label")
        radioButtonText.innerHTML = $headerText;

        $divElement.appendChild(radioButton);
        $divElement.appendChild(radioButtonText);
    }

    for(var i=0; i<justHeaders.length; i++){
        radioButtonMaker("source", justHeaders[i], sourceSelection);
        radioButtonMaker("target", justHeaders[i], targetSelection);
    }

    for(var i=0; i<justHeaders.length; i++){
        document.getElementById('source-'+justHeaders[i]).addEventListener('change', handleSource, false)
        document.getElementById('target-'+justHeaders[i]).addEventListener('change', handleTarget, false)
    }
}
var handleHeaderNo = function(event){
    localStorage.setItem('headerSetting', 'no');

    var justHeadersStorage = localStorage.getItem('headers');
    var justHeaders = justHeadersStorage.split(",");

    for(var i=0; i<justHeaders.length; i++){
        document.getElementById("source-" + justHeaders[i]).remove();
        document.getElementById("source-" + justHeaders[i] + "label").remove();
        document.getElementById("target-" + justHeaders[i]).remove();
        document.getElementById("target-" + justHeaders[i] + "label").remove();
    }
    document.getElementById("sourceh5").remove();
    document.getElementById("targeth5").remove();
}
var handleGraphUndirected = function(event){localStorage.setItem('graphTypeSetting', 'undirected');}
var handleGraphDirected = function(event){localStorage.setItem('graphTypeSetting', 'directed');}
var handleMergeSum = function(event){localStorage.setItem('mergeTypeSetting', 'sum');}
var handleMergeDontMerge = function(event){localStorage.setItem('mergeTypeSetting', 'dont merge');}

var handleSource = function(event){
    var source = event.target.id;
    var sourceName = source.replace("source-", ""); //Remove "source-" to just get the column name
    var sourceIndex;

    //Get the index that corresponds to the source 
    var justHeaders = headers.split(",");
    for(var i=0; i<justHeaders.length; i++){
        if(justHeaders[i] === sourceName){
            sourceIndex = i;
        }
    }

    var justEdgeData = edgeData.split("\n");
    justEdgeData.shift(); // Removes all the headers
    var allSourceData = [];
    // Makes a list of JUST the source nodes
    for(var i=0; i<justEdgeData.length; i++){
        var currentIndexOfEdgeData = justEdgeData[i].split(",");
        for(var j=0; j<currentIndexOfEdgeData.length; j++){
            if(j === sourceIndex){
                allSourceData.push(currentIndexOfEdgeData[j]); 
            }
        }
    }

    sourceHeader = justHeaders[sourceIndex];

    // sourceData = allSourceData;
    localStorage.setItem('sourceData', allSourceData);
}

var handleTarget = function(event){
    var target = event.target.id;
    var targetName = target.replace("target-", ""); //Remove "target-" just to get the column name 
    var targetIndex;

    //Get the index that corresponds to the target
    var justHeaders = headers.split(",");
    for(var i=0; i<justHeaders.length; i++){
        if(justHeaders[i] === targetName){
            targetIndex = i;
        }
    }

    var justEdgeData = edgeData.split("\n");
    justEdgeData.shift(); // Removes all the headers
    var allTargetData = [];
    // Makes a list of JUST the target nodes
    for(var i=0; i<justEdgeData.length; i++){
        var currentIndexOfEdgeData = justEdgeData[i].split(",");
        for(var j=0; j<currentIndexOfEdgeData.length; j++){
            if(j === targetIndex){
                allTargetData.push(currentIndexOfEdgeData[j]); 
            }
        }
    }

    targetHeader = justHeaders[targetIndex];

    targetData = allTargetData;
    localStorage.setItem('targetData', allTargetData);
}

var createTables = function(event){
    $.ajax({
        url: 'data-controller.php/settings',
        method: 'post',
        data: {
            header: headerSetting,
            graphType: graphTypeSetting,
            mergeType: mergeTypeSetting,
            source: sourceData,
            target: targetData,
            node: nodeData
        },
        success: function( response){
            // alert(response);
        },
        error: function(jqXHR, status, error){
            // alert(jqXHR, status, error);
        }
    });

    $("#file-uploads").hide();
    $("#data_page").show();

    edgesGridData = [];

    var justSourceData = localStorage.getItem('sourceData').split(",");
    var justTargetData = localStorage.getItem('targetData').split(",");
    for(var i=0; i<justSourceData.length; i++){
        edgesGridData.push({sourceHeader: justSourceData[i], targetHeader: justTargetData[i]});
    }

    $("#edgesGrid").jsGrid({
        width: "100%",
        height: "100%",

        sorting: true,
        paging: true,

        data: edgesGridData,

        fields: [
            { name: sourceHeader, type: "text"}, 
            { name: targetHeader, type: "text"}
        ]
    });

    $("#networkStatsGrid").jsGrid({
        width: "100%",
        height: "100%",

        inserting: true,
        editing: true,
        sorting: true,
        paging: true,
        
    });

    event.preventDefault();
    // window.history.pushState("", "Title", "/~touellette/data_tables");
};

var returnToUploads = function(event){
    $("#file-uploads").show();
    $("#data_page").hide();

    // Help with URL modification: https://stackoverflow.com/questions/38089507/how-to-change-url-after-success-in-ajax-without-page-reload
    window.history.pushState("", "Title", "/~touellette/csc302_project");
};

function handleEdgeFileUpload(event){
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            edgeData = e.target.result;// This is where the data is actually read
            localStorage.setItem('edgeData', edgeData);  
        };
    })(file);

    reader.readAsText(file);

}

function handleNodeFileUpload(event){
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e){
            nodeData = e.target.result; // This is where the data is actually read
            localStorage.setItem('nodeData', nodeData);
        };
    })(file);

    reader.readAsText(file);
}


var clients = [
    { "Name": "Otto Clay", "Age": 25, "Country": 1, "Address": "Ap #897-1459 Quam Avenue", "Married": false },
    { "Name": "Connor Johnston", "Age": 45, "Country": 2, "Address": "Ap #370-4647 Dis Av.", "Married": true },
    { "Name": "Lacey Hess", "Age": 29, "Country": 3, "Address": "Ap #365-8835 Integer St.", "Married": false },
    { "Name": "Timothy Henson", "Age": 56, "Country": 1, "Address": "911-5143 Luctus Ave", "Married": true },
    { "Name": "Ramona Benton", "Age": 32, "Country": 3, "Address": "Ap #614-689 Vehicula Street", "Married": false }
];






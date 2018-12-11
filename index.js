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

    $(document).on('click', "#nodes-view", showNodesTable)
    $(document).on('click', "#edges-view", showEdgesTable)

});

var handleHeaderYes = function(event){
    var fileName = document.getElementById('upload-edge-file').files[0].name;
    var fileType = fileName.slice(-3);
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
    var fileName = document.getElementById('upload-edge-file').files[0].name;
    var fileType = fileName.slice(-3);
    if(fileType === "tsv"){
        var newEdgeData = edgeData.replace(/\t/g, ",");
        localStorage.setItem('edgeData', newEdgeData);
        edgeData = localStorage.getItem('edgeData');
    }

    localStorage.setItem('headerSetting', 'no');

    var allDataArray = edgeData.split("\n");
    var firstRow = allDataArray[0].split(",");
    for(var i=0; i<firstRow.length; i++){firstRow[i] = firstRow[i].replace(/\s+/g, '');}
    localStorage.setItem('headers', firstRow);

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

    radioButtonMaker = function($vertex, $firstRow, $divElement, $number){
        var radioButton = document.createElement("input");
        radioButton.setAttribute("type", "radio");
        radioButton.setAttribute("id", $vertex + "-" + $firstRow);
        radioButton.setAttribute("class", "radio");

        var radioButtonText = document.createElement("label");
        radioButtonText.setAttribute("id", $vertex + "-" + $firstRow + "label")
        radioButtonText.innerHTML = "Column " + $number;

        $divElement.appendChild(radioButton);
        $divElement.appendChild(radioButtonText);
    }

    for(var i=0; i<firstRow.length; i++){
        radioButtonMaker("source", firstRow[i], sourceSelection, i);
        radioButtonMaker("target", firstRow[i], targetSelection, i);
    }

    for(var i=0; i<firstRow.length; i++){
        document.getElementById('source-'+firstRow[i]).addEventListener('change', handleSource, false)
        document.getElementById('target-'+firstRow[i]).addEventListener('change', handleTarget, false)
    }
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
    $("#file-uploads").hide();
    $("#data_page").show();

    var justSourceData = localStorage.getItem('sourceData').split(",");
    var justTargetData = localStorage.getItem('targetData').split(",");

    // This makes an array of Nodes if one wasn't already made by uploading a node file
    if(localStorage.getItem('nodeData') === null){
        allNodeData = [];
        for(var i=0; i<justSourceData.length; i++){
            // How to add non-dupes to array: 
            // https://stackoverflow.com/questions/10757516/how-to-prevent-adding-duplicate-keys-to-a-javascript-array
            if($.inArray(justSourceData[i], allNodeData)==-1){
                allNodeData.push(justSourceData[i]);
            }
        }
        for(var i=0; i<justTargetData.length; i++){
            if($.inArray(justTargetData[i], allNodeData)==-1){
                allNodeData.push(justTargetData[i]);
            }
        }
        nodeData = allNodeData;
        localStorage.setItem('nodeData', allNodeData);
    }

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

    // Populates the edge table
    edgesGridData = [];
    for(var i=0; i<justSourceData.length; i++){
        var dataForEdges = {};
        dataForEdges[sourceHeader] = justSourceData[i];
        dataForEdges[targetHeader] = justTargetData[i];
        edgesGridData.push(dataForEdges);
    }
    $("#edgesGrid").jsGrid({
        width: "100%",
        height: "auto",

        sorting: true,
        paging: true,

        data: edgesGridData,

        fields: [
            { name: sourceHeader, type: "text"}, 
            { name: targetHeader, type: "text"}
        ]
    });

    nodesGridData = [];
    var justNodeData = localStorage.getItem('nodeData').split(",");
    for(var i=0; i<justNodeData.length; i++){
        var dataForNodes = {};
        dataForNodes["Node"] = justNodeData[i];
        dataForNodes["In-Degree"] = calculateInDegree(justNodeData[i], justTargetData, localStorage.getItem('graphTypeSetting'));
        dataForNodes["Out-Degree"] = calculateOutDegree(justNodeData[i], justSourceData, localStorage.getItem('graphTypeSetting'));
        dataForNodes["Degree (In + Out)"] = calculateDegree(justNodeData[i], justSourceData, justTargetData, localStorage.getItem('graphTypeSetting'));
        nodesGridData.push(dataForNodes);
    }
    $("#nodesGrid").jsGrid({
        width: "100%",
        height: "auto",

        sorting: true,
        paging: true,

        data: nodesGridData,

        fields: [
            {name: "Node", type: "text"},
            {name: "In-Degree", type: "number"},
            {name: "Out-Degree", type: "number"},
            {name: "Degree (In + Out)", type: "number"},
            {name: "Betweeness Centrality", type: "number"},
            {name: "Closeness Centrality", type: "number"}            
        ]
    });

    networkStatsGridData = [
        {
            "Total Nodes" : calculateTotalNodes(justNodeData),
            "Total Edges" : calculateTotalEdges(justSourceData), 
            "Unique Edges" : 0,
            "Max Geodesic Distance (Diameter)" : 0,
            "Avg Geodesic Distance" : 0,
            "Density" : 0,
            "Num Connected Components" : 0,
            "Avg Num Nodes + Edges Across Connected Components" : 0,
            "Avg In-Degree" : calculateAvgInDegree(justNodeData, justTargetData, localStorage.getItem('graphTypeSetting')),
            "Avg Out-Degree" : calculateAvgOutDegree(justNodeData, justSourceData, localStorage.getItem('graphTypeSetting')),
            "Avg Degree (In + Out)" : calculateAvgDegree(justNodeData, justSourceData, justTargetData, localStorage.getItem('graphTypeSetting'))
        }
    ];

    $("#networkStatsGrid").jsGrid({
        width: "100%",
        height: "auto",

        sorting: true,
        paging: true,

        data: networkStatsGridData,

        fields: [
            {name: "Total Nodes", type: "number"},
            {name: "Total Edges", type: "number"},
            {name: "Unique Edges", type: "number"},
            {name: "Max Geodesic Distance (Diameter)", type: "number"},
            {name: "Avg Geodesic Distance", type: "number"},
            {name: "Density", type: "number"}, 
            {name: "Num Connected Components", type: "number"},
            {name: "Avg Num Nodes + Edges Across Connected Components", type: "number"},
            {name: "Avg In-Degree", type: "number"},
            {name: "Avg Out-Degree", type: "number"},
            {name: "Avg Degree (In + Out)", type: "number"}
        ]
        
    });

    event.preventDefault();
    // window.history.pushState("", "Title", "/~touellette/data_tables");
};

// Entire Network Metrics
function calculateTotalNodes(nodes){
    return nodes.length;
}
function calculateTotalEdges(sources){
    // Only needs source since there's never going to be more sources than targets and vice versa
    return sources.length;
}
function calculateUniqueEdges(sources, targets){

}
function calculateMaxGeodesicDistance(){

}
function calculateAvgGeodesicDistance(){

}
function calculateDensity(){

}
function calculateNumConnectedComponents(){

}
function calculateAvgNumNodesEdgesAcrossConnectedComponents(){

}
function calculateAvgInDegree(nodes, targets, graphType){
    var totalInDegree = 0;
    var numNodes = nodes.length;
    if(graphType === "directed"){
        for(var i=0; i<nodes.length; i++){
            totalInDegree += calculateInDegree(nodes[i], targets, graphType);
        }
    }

    return (totalInDegree/numNodes).toFixed(4);
}
function calculateAvgOutDegree(nodes, sources, graphType){
    var totalOutDegree = 0;
    var numNodes = nodes.length;
    if(graphType === "directed"){
        for(var i=0; i<nodes.length; i++){
            totalOutDegree += calculateOutDegree(nodes[i], sources, graphType);
        }
    }

    return (totalOutDegree/numNodes).toFixed(4);
}
function calculateAvgDegree(nodes, sources, targets, graphType){
    var totalDegree = 0;
    var numNodes = nodes.length;
    for(var i=0; i<nodes.length; i++){
        totalDegree += calculateDegree(nodes[i], sources, targets, graphType);
    }

    return (totalDegree/numNodes).toFixed(4);
}

// Per Node Metrics
function calculateInDegree(node, targets, graphType){
    var inDegree = 0;
    if(graphType === "directed"){
        for(var i=0; i<targets.length; i++){
            if(targets[i] === node){
                inDegree += 1;
            }
        }
    }
    return inDegree;
}
function calculateOutDegree(node, sources, graphType){
    var outDegree = 0;
    if(graphType === "directed"){
        for(var i=0; i<sources.length; i++){
            if(sources[i] === node){
                outDegree += 1;
            }
        }
    }
    return outDegree;
}
function calculateDegree(node, sources, targets, graphType){
    var degree = 0;
    if(graphType === "directed"){
        degree += calculateInDegree(node, targets, graphType);
        degree += calculateOutDegree(node, sources, graphType);
    }
    else{

    }

    return degree;
}
function calculateBetweenessCentrality(){

}
function calculateClosenessCentrality(){

}

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

function showNodesTable(event){
    $("#nodesGrid").show();
    $("#nodes-view").prop("disabled", true);
    $("#edgesGrid").hide();
    $("#edges-view").prop("disabled", false);
}
function showEdgesTable(event){
    $("#edgesGrid").show();
    $("#edges-view").prop("disabled", true);
    $("#nodesGrid").hide();
    $("#nodes-view").prop("disabled", false);
}






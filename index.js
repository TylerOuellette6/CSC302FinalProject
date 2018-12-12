// Data for nodes and edges
var edgeData = localStorage.getItem('edgeData');
var nodeData = localStorage.getItem('nodeData');
var headers = localStorage.getItem('headers');

// Just sources and targets
var sourceData = localStorage.getItem('source');
var targetData = localStorage.getItem('target');

// All the "settings" that the user selects
var headerSetting = localStorage.getItem('headerSetting');
var graphTypeSetting = localStorage.getItem('graphTypeSetting');
var mergeTypeSetting = localStorage.getItem('mergeTypeSetting');

// Header titles for the graph
var sourceHeader = null;
var targetHeader = null;

// Array of all the data that will be written out to a file
var nodeDataToSave = [];
var networkDataToSave = [];

$(document).ready(function(){
    localStorage.clear();

    // Handles navigating between pages
    $(document).on('click', "#create-tables", createTables)
    $(document).on('click', "#return-to-uploads", returnToUploads)

    // Handles when files are uploaded
    document.getElementById('upload-edge-file').addEventListener('change', handleEdgeFileUpload, false)
    document.getElementById('upload-node-file').addEventListener('change', handleNodeFileUpload, false)

    // Handles settings 
    document.getElementById('header-yes').addEventListener('change', handleHeaderYes, false)
    document.getElementById('header-no').addEventListener('change', handleHeaderNo, false)
    document.getElementById('graph-undirected').addEventListener('change', handleGraphUndirected, false)
    document.getElementById('graph-directed').addEventListener('change', handleGraphDirected, false)
    document.getElementById('merge-sum').addEventListener('change', handleMergeSum, false)
    document.getElementById('merge-dontmerge').addEventListener('change', handleMergeDontMerge, false)

    // Handles switching between edges and nodes tables 
    $(document).on('click', "#nodes-view", showNodesTable)
    $(document).on('click', "#edges-view", showEdgesTable)

    // Handles user saving the data
    $(document).on('click', "#save-as-tsv", saveAsTSV)
    $(document).on('click', "#save-as-csv", saveAsCSV)

});

/**
    * Helper function to reduce code for making radio buttons
    * Makes a radio button using the passed in parameters and adds it to the page
    *
    * @param vertex - Either source or target
    * @param firstRow - The text of the first row
    * @param divElement - Which part of the page the new radio button will go on
    * @param number - The number of the column 
    */
radioButtonMaker = function($vertex, $headerText, $divElement){
    // Makes the button
    var radioButton = document.createElement("input");
    radioButton.setAttribute("type", "radio");
    radioButton.setAttribute("id", $vertex + "-" + $headerText);
    radioButton.setAttribute("class", "radio");

    // Makes a label for the button
    var radioButtonText = document.createElement("label");
    radioButtonText.setAttribute("id", $vertex + "-" + $headerText + "label")
    radioButtonText.innerHTML = $headerText;

    // Adds the button and label to the HTML page
    $divElement.appendChild(radioButton);
    $divElement.appendChild(radioButtonText);
}

var handleHeaderYes = function(event){
    // Get the file
    var fileName = document.getElementById('upload-edge-file').files[0].name;
    // Get the type of file
    var fileType = fileName.slice(-3);
    // If it's a tsv, convert it to csv
    if(fileType === "tsv"){
        var newEdgeData = edgeData.replace(/\t/g, ",");
        localStorage.setItem('edgeData', newEdgeData);
        edgeData = localStorage.getItem('edgeData');
    }

    // Set the header settings
    localStorage.setItem('headerSetting', 'yes');

    // Get all the headers and store them
    var allDataArray = edgeData.split("\n");
    var justHeaders = allDataArray[0].split(",");
    for(var i=0; i<justHeaders.length; i++){justHeaders[i] = justHeaders[i].replace(/\s+/g, '');}
    localStorage.setItem('headers', justHeaders);

    // HTML elements
    var sourceSelection = document.getElementById("source-selection");
    var targetSelection = document.getElementById("target-selection");

    // Source label
    var sourceh5 = document.createElement("h5");
    sourceh5.innerHTML = "Source: ";
    sourceh5.setAttribute("id", "sourceh5");
    sourceSelection.appendChild(sourceh5);

    // Target label
    var targeth5 = document.createElement("h5");
    targeth5.innerHTML = "Target: ";
    targeth5.setAttribute("id", "targeth5");
    targetSelection.appendChild(targeth5);

    // For loop to make enough radio buttons to correspond to each header
    for(var i=0; i<justHeaders.length; i++){
        radioButtonMaker("source", justHeaders[i], sourceSelection);
        radioButtonMaker("target", justHeaders[i], targetSelection);
    }

    // For loop to add event listeners to all the radio buttons
    for(var i=0; i<justHeaders.length; i++){
        document.getElementById('source-'+justHeaders[i]).addEventListener('change', handleSource, false)
        document.getElementById('target-'+justHeaders[i]).addEventListener('change', handleTarget, false)
    }
}

var handleHeaderNo = function(event){
    // Get the file
    var fileName = document.getElementById('upload-edge-file').files[0].name;
    // Get the type of file
    var fileType = fileName.slice(-3);
    // If it's a tsv, convert it to csv
    if(fileType === "tsv"){
        var newEdgeData = edgeData.replace(/\t/g, ",");
        localStorage.setItem('edgeData', newEdgeData);
        edgeData = localStorage.getItem('edgeData');
    }

    // Set the header settings
    localStorage.setItem('headerSetting', 'no');

    // Get all the headers and store them
    var allDataArray = edgeData.split("\n");
    var firstRow = allDataArray[0].split(",");
    for(var i=0; i<firstRow.length; i++){firstRow[i] = firstRow[i].replace(/\s+/g, '');}
    localStorage.setItem('headers', firstRow);

    // HTML elements
    var sourceSelection = document.getElementById("source-selection");
    var targetSelection = document.getElementById("target-selection");

    // Source label
    var sourceh5 = document.createElement("h5");
    sourceh5.innerHTML = "Source: ";
    sourceh5.setAttribute("id", "sourceh5");
    sourceSelection.appendChild(sourceh5);

    // Target label
    var targeth5 = document.createElement("h5");
    targeth5.innerHTML = "Target: ";
    targeth5.setAttribute("id", "targeth5");
    targetSelection.appendChild(targeth5);

    // For loop to make enough radio buttons to correspond to each header
    for(var i=0; i<firstRow.length; i++){
        radioButtonMaker("source", firstRow[i], sourceSelection, i);
        radioButtonMaker("target", firstRow[i], targetSelection, i);
    }

    // For loop to add event listeners to all the radio buttons
    for(var i=0; i<firstRow.length; i++){
        document.getElementById('source-'+firstRow[i]).addEventListener('change', handleSource, false)
        document.getElementById('target-'+firstRow[i]).addEventListener('change', handleTarget, false)
    }
}
// These are all just for the remaining settings, handles what to do when the radio buttons are pressed
var handleGraphUndirected = function(event){localStorage.setItem('graphTypeSetting', 'undirected');}
var handleGraphDirected = function(event){localStorage.setItem('graphTypeSetting', 'directed');}
var handleMergeSum = function(event){localStorage.setItem('mergeTypeSetting', 'sum');}
var handleMergeDontMerge = function(event){localStorage.setItem('mergeTypeSetting', 'dont merge');}

// This is the function that the radio buttons that were created above call
var handleSource = function(event){
    // Get just the source name without any extra text
    var source = event.target.id;
    var sourceName = source.replace("source-", ""); //Remove "source-" to just get the column name
    // The index of where the source header is in the list
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

    // Save the new info
    sourceHeader = justHeaders[sourceIndex];
    localStorage.setItem('sourceData', allSourceData);
}

// Similar to above function, but this one handles targets
var handleTarget = function(event){
    // Get just the target name without any extra texxt
    var target = event.target.id;
    var targetName = target.replace("target-", ""); //Remove "target-" just to get the column name 
    // The index of where the target header is in the list
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

    // Save the new info
    targetHeader = justHeaders[targetIndex];
    localStorage.setItem('targetData', allTargetData);
}

// This function does a lot, including:
// Hiding the first page and showing the new one
// Making a list of nodes if there isn't one already
// Sending dating up to the server using AJAX
// Calculating network statistics
// Populating and creating jsGrid tables 
var createTables = function(event){
    // Toggling between the "pages"
    $("#file-uploads").hide();
    $("#data_page").show();

    // Get the source and target data
    // These are used throughout the function 
    var justSourceData = localStorage.getItem('sourceData').split(",");
    var justTargetData = localStorage.getItem('targetData').split(",");

    // This makes an array of Nodes if one wasn't already made by uploading a node file
    if(localStorage.getItem('nodeData') === null){
        allNodeData = [];
        // Go through the sources and add non duplicates
        for(var i=0; i<justSourceData.length; i++){
            // How to add non-dupes to array: 
            // https://stackoverflow.com/questions/10757516/how-to-prevent-adding-duplicate-keys-to-a-javascript-array
            if($.inArray(justSourceData[i], allNodeData)==-1){
                allNodeData.push(justSourceData[i]);
            }
        }
        // Go through the targets and add non duplicates
        for(var i=0; i<justTargetData.length; i++){
            if($.inArray(justTargetData[i], allNodeData)==-1){
                allNodeData.push(justTargetData[i]);
            }
        }
        // Save the data
        nodeData = allNodeData;
        localStorage.setItem('nodeData', allNodeData);
    }

    // AJAX call to the server
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
    // Makes the table with the data from above
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

    // Populates the nodes table
    nodesGridData = [];
    var justNodeData = localStorage.getItem('nodeData').split(",");
    // Populate the data to save with the Node Headers
    nodeDataToSave.push("Node", "In-Degree", "Out-Degree", "Degree", "Betweeness Centrality", "Closeness Centrality\n");
    // Goes through all the nodes and does calculations on all of them
    for(var i=0; i<justNodeData.length; i++){
        var dataForNodes = {};
        dataForNodes["Node"] = justNodeData[i];
        nodeDataToSave.push(justNodeData[i]);
        dataForNodes["In-Degree"] = calculateInDegree(justNodeData[i], justTargetData, localStorage.getItem('graphTypeSetting'), true);
        dataForNodes["Out-Degree"] = calculateOutDegree(justNodeData[i], justSourceData, localStorage.getItem('graphTypeSetting'), true);
        dataForNodes["Degree (In + Out)"] = calculateDegree(justNodeData[i], justSourceData, justTargetData, localStorage.getItem('graphTypeSetting'), true);
        dataForNodes["Betweeness Centrality"] = calculateBetweenessCentrality();
        dataForNodes["Closeness Centrality"] = calculateClosenessCentrality();
        nodesGridData.push(dataForNodes);
    }
    // Makes the table with the data from above 
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

    // Populate the data to save with the Network Stats Headers
    networkDataToSave.push("\nTotal Nodes", "Total Edges", "Unique Edges", "Diameter", 
        "Avg Geodesic Distance", "Density", "Num Connected Components", 
        "Avg Num Nodes Across Connected Components", "Avg In-Degree", "Avg Out-Degree",
        "Avg Degree");
    // Populates the network statistics table
    networkStatsGridData = [
        {
            "Total Nodes" : calculateTotalNodes(justNodeData),
            "Total Edges" : calculateTotalEdges(justSourceData), 
            "Unique Edges" : calculateUniqueEdges(justSourceData, justTargetData),
            "Max Geodesic Distance (Diameter)" : calculateMaxGeodesicDistance(),
            "Avg Geodesic Distance" : calculateAvgGeodesicDistance(),
            "Density" : calculateDensity(justSourceData, justNodeData),
            "Num Connected Components" : calculateNumConnectedComponents(),
            "Avg Num Nodes + Edges Across Connected Components" : calculateAvgNumNodesEdgesAcrossConnectedComponents(),
            "Avg In-Degree" : calculateAvgInDegree(justNodeData, justTargetData, localStorage.getItem('graphTypeSetting')),
            "Avg Out-Degree" : calculateAvgOutDegree(justNodeData, justSourceData, localStorage.getItem('graphTypeSetting')),
            "Avg Degree (In + Out)" : calculateAvgDegree(justNodeData, justSourceData, justTargetData, localStorage.getItem('graphTypeSetting'))
        }
    ];
    // Makes the table with the data from above
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
};

// Allows the user to go back to the uploads page
var returnToUploads = function(event){
    $("#file-uploads").show();
    $("#data_page").hide();

    // Help with URL modification: https://stackoverflow.com/questions/38089507/how-to-change-url-after-success-in-ajax-without-page-reload
    window.history.pushState("", "Title", "/~touellette/csc302_project");
};

// Read in the data from the edge file and store it in localStorage
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

// Read in the data from the node file and store it in localStorage
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

// These functions toggle between the nodes table and the edges table
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

function saveAsTSV(){
    var zip = new JSZip();
    // Convert commas to tabs
    var tabbedNodeData = nodeDataToSave.toString().replace(/,/g, "\t");
    var tabbedNetworkData = networkDataToSave.toString().replace(/,/g, "\t");
    // Create the files with the data
    zip.file("node-data.tsv", tabbedNodeData.toString());
    zip.file("network-data.tsv", tabbedNetworkData.toString());

    // Save the files in the ZIP
    zip.generateAsync({type:"blob"}).then(function(blob) {
        saveAs(blob, "all-data.zip");
    });
}
function saveAsCSV(){
    var zip = new JSZip();
    // Create the files with the data
    zip.file("node-data.csv", nodeDataToSave.toString());
    zip.file("network-data.csv", networkDataToSave.toString());

    // Save the files in the ZIP
    zip.generateAsync({type:"blob"}).then(function(blob) {
        saveAs(blob, "all-data.zip");
    });
}

// Calculations
// Entire Network Metrics
function calculateTotalNodes(nodes){
    networkDataToSave.push(nodes.length);
    return nodes.length;
}
function calculateTotalEdges(sources){
    networkDataToSave.push(sources.length);
    // Only needs source since there's never going to be more sources than targets and vice versa
    return sources.length;
}
function calculateUniqueEdges(sources, targets){
    var numUniqueEdges = 0;
    var allEdges = [];
    // Make the edge and target one string
    for(var i=0; i<sources.length; i++){
        var sourceAndTargetCombo;
        sourceAndEdgeCombo = sources[i] + targets[i];
        allEdges.push(sourceAndTargetCombo)
    }

    // How to remove dupes: https://wsvincent.com/javascript-remove-duplicates-array/
    // Remove all the duplicates from the allEdges array and put in a unique array
    let uniqueEdges = [...new Set(allEdges)];
    numUniqueEdges = uniqueEdges.length;

    networkDataToSave.push(numUniqueEdges);
    return numUniqueEdges;
}
function calculateMaxGeodesicDistance(){
    var diameter = 0;

    networkDataToSave.push(diameter);
    return diameter;
}
function calculateAvgGeodesicDistance(){
    var avgGeodesicDistance = 0;

    networkDataToSave.push(avgGeodesicDistance);
    return avgGeodesicDistance;
}
function calculateDensity(sources, nodes){
    var numEdges = calculateTotalEdges(sources);
    var numNodes = calculateTotalNodes(nodes);

    // Equation(s) for Density:
    // Actual Connections (Edges) / Potential Connections
    // Potential Connections = (numNodes * (numNodes - 1))/ 2
    var pc = (numNodes * (numNodes-1))/2;
    var density = numEdges / pc;

    networkDataToSave.push(density);
    return density.toFixed(6);
}
function calculateNumConnectedComponents(){
    var numComponents = 0;

    networkDataToSave.push(numComponents);
    return numComponents;
}
function calculateAvgNumNodesEdgesAcrossConnectedComponents(){
    var avgNumNodesPerComponent = 0

    networkDataToSave.push(avgNumNodesPerComponent);
    return avgNumNodesPerComponent;
}
function calculateAvgInDegree(nodes, targets, graphType){
    var totalInDegree = 0;
    var numNodes = nodes.length;
    if(graphType === "directed"){
        for(var i=0; i<nodes.length; i++){
            totalInDegree += calculateInDegree(nodes[i], targets, graphType, false);
        }
    }

    networkDataToSave.push(totalInDegree/numNodes);
    return (totalInDegree/numNodes).toFixed(4);
}
function calculateAvgOutDegree(nodes, sources, graphType){
    var totalOutDegree = 0;
    var numNodes = nodes.length;
    if(graphType === "directed"){
        for(var i=0; i<nodes.length; i++){
            totalOutDegree += calculateOutDegree(nodes[i], sources, graphType, false);
        }
    }

    networkDataToSave.push(totalOutDegree/numNodes);
    return (totalOutDegree/numNodes).toFixed(4);
}
function calculateAvgDegree(nodes, sources, targets, graphType){
    var totalDegree = 0;
    var numNodes = nodes.length;
    for(var i=0; i<nodes.length; i++){
        totalDegree += calculateDegree(nodes[i], sources, targets, graphType, false);
    }

    networkDataToSave.push(totalDegree/numNodes);
    return (totalDegree/numNodes).toFixed(4);
}

// Per Node Metrics
function calculateInDegree(node, targets, graphType, firstTime){
    var inDegree = 0;
    if(graphType === "directed"){
        for(var i=0; i<targets.length; i++){
            if(targets[i] === node){
                inDegree += 1;
            }
        }
    }
    if(firstTime){nodeDataToSave.push(inDegree);}
    return inDegree;
}
function calculateOutDegree(node, sources, graphType, firstTime){
    var outDegree = 0;
    if(graphType === "directed"){
        for(var i=0; i<sources.length; i++){
            if(sources[i] === node){
                outDegree += 1;
            }
        }
    }
    if(firstTime){nodeDataToSave.push(outDegree);}
    return outDegree;
}
function calculateDegree(node, sources, targets, graphType, firstTime){
    var degree = 0;
    if(graphType === "directed"){
        degree += calculateInDegree(node, targets, graphType);
        degree += calculateOutDegree(node, sources, graphType);
    }
    else{
        for(var i=0; i<sources.length; i++){
            if(sources[i] === node){
                degree += 1;
            }
            else if(targets[i] === node){
                degree += 1;
            }
        }
    }
    if(firstTime){nodeDataToSave.push(degree);}
    return degree;
}
function calculateBetweenessCentrality(){
    var betweeness = 0;

    nodeDataToSave.push(betweeness);
    return betweeness;
}
function calculateClosenessCentrality(){
    var closeness = 0;

    nodeDataToSave.push(closeness + "\n");
    return closeness;
}
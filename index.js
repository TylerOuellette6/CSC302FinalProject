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

});

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

    /**
    * Helper function to reduce code for making radio buttons
    * Makes a radio button using the passed in parameters and adds it to the page
    *
    * @param vertex - Either source or target
    * @param headerText - The text of the header (based on the document)
    * @param divElement - Which part of the page the new radio button will go on
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

    /**
    * Helper function to reduce code for making radio buttons
    * Makes a radio button using the passed in parameters and adds it to the page
    *
    * @param vertex - Either source or target
    * @param firstRow - The text of the first row
    * @param divElement - Which part of the page the new radio button will go on
    * @param number - The number of the column 
    */
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
    // Goes through all the nodes and does calculations on all of them
    for(var i=0; i<justNodeData.length; i++){
        var dataForNodes = {};
        dataForNodes["Node"] = justNodeData[i];
        dataForNodes["In-Degree"] = calculateInDegree(justNodeData[i], justTargetData, localStorage.getItem('graphTypeSetting'));
        dataForNodes["Out-Degree"] = calculateOutDegree(justNodeData[i], justSourceData, localStorage.getItem('graphTypeSetting'));
        dataForNodes["Degree (In + Out)"] = calculateDegree(justNodeData[i], justSourceData, justTargetData, localStorage.getItem('graphTypeSetting'));
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

    // Populates the network statistics table
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
    // window.history.pushState("", "Title", "/~touellette/data_tables");
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


// Calculations
// Entire Network Metrics
function calculateTotalNodes(nodes){
    return nodes.length;
}
function calculateTotalEdges(sources){
    // Only needs source since there's never going to be more sources than targets and vice versa
    return sources.length;
}
function calculateUniqueEdges(sources, targets, graphType){

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
        for(var i=0; i<sources.length; i++){
            if(sources[i] === node){
                degree += 1;
            }
            else if(targets[i] === node){
                degree += 1;
            }
        }
    }

    return degree;
}
function calculateBetweenessCentrality(){

}
function calculateClosenessCentrality(){

}
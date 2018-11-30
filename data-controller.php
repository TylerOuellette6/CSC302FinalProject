<?php

	$prefix = "/~touellette/csc302_projet/data-controller.php";

	$dbName = "/home/touellette/csc302-fa18-data/final-project.db";
	$dsn = "sqlite:$dbName";
	$dbh = null;

	$routes = [
		makeRoute("POST", "#^/settings/?(\?.*)?$#", handleBuildGraphButtonClick)
	];

	$uri = preg_replace("#^". $prefix ."/?#", "/", $_SERVER['REQUEST_URI']);

	$method = $_SERVER["REQUEST_METHOD"];
	$params = $_GET;
	if($method == "POST"){
		$params = "$_POST";
		if(array_key_exists("_method", $_POST))
			$method = $_POST["_method"];
	}

	$foundMatchingRoute = false;
	$match = [];
	foreach($routes as $route){
	    if($method == $route["method"]){
	        preg_match($route["pattern"], $uri, $match);
	        if($match){
	            die(json_encode($route["controller"]($uri, $match, $params)));
	            $foundMatchingRoute = true;
	        }
	    }
	}

	if(!$foundMatchingRoute){
	    echo "No route found for: $uri";
	}

	function makeRoute($method, $pattern, $function){
		return[
			"method" => $method,
			"pattern" => $pattern,
			"controller" => $function
		];
	}

	function connectToDB(){
		global $dsn;
		global $dbh;

		try{
			if($dbh == null){
				$dbh = new PDO($dsn);
				setupDB();
			}
		} catch(PDOException $e){
			die("Could not establish connection to the database: " $e->getMessage());
		}
	}

	function setupDB(){
		global $dbh;
		try{
			// Data settings
			$dbh->exec(
				"create table if not exists data_settings(".
				"header text".
				"graph_type text".
				"merge_type text"
			);
			$error = $dbh->errorInfo();
			if($error[0] !== '00000' && $error[0] !== '01000'){
				die("There was an error setting up the network_data table: ". $error[2]);
			}

			//Entire network data table
			$dbh->exec(
				"create table if not exists network_data(".
				"total_nodes integer".
				"total_edges integer".
				"unique_edges integer".
				"max_geodesic_dist real".
				"avg_geodesic_dist real".
				"density real".
				"num_connected_components integer".
				"avg_num_nodes_and_edges_across_connected_components real".
				"avg_in_degree real".
				"avg_out_degree real".
				"avg_degree_in_and_out real)"
			);
			$error = $dbh->errorInfo();
			if($error[0] !== '00000' && $error[0] !== '01000'){
				die("There was an error setting up the network_data table: ". $error[2]);
			}

			//Node data table, per node 
			$dbh->exec(
				"create table if not exists node_data".
				"in_degree real".
				"out_degree real".
				"degree_in_and_out real".
				"betweeness_centrality real".
				"closeness_centrality real)"
			);
			$error = $dbh->errorInfo();
			if($error[0] !== '00000' && $error[0] !== '01000'){
				die("There was an error setting up the node_data table: ". $error[2]);
			}

		} catch(PDOException $e){
			die("There was an error setting up the database: " $e->getMessage());
		}
	}

	function handleBuildGraphButtonClick($data){
		global $dbh;
		connectToDB();
	}

	function handleGraphSettings($data){
		

	}
	

	function handleEdges($data){
		// Save all the edges to two array lists
		// One for the first node, one for the second node
	}

	function handleNodes($data){
		// Save all the nodes to an array list
	}

	// Basic Network Metrics
	function calculateTotalNodes($data){
		// Passed in parameter will be nodes list
		// For loop through list, add one to variable every time 
	}

	function calculateTotalEdges($data){
		// Passed in parameter will be edges lists
		// For loop through list, add one to variable every time
	}

	function calculateUniqueEdges($data){
		// Passed in parameter will be edges lists
		// Add both edges to a list as one variable when it's not already in the list
		// If a match is found in the list, remove it from the unique list and add it to
		// a list of "already discovered" edges
		// Add up the total number of variables in the unique list
	}

	function calculateMaxGeodesicDistance($data){

	}

	function calculateDensity($data){
		// Potential connections: (n*(n-1))/2
		// Actual connections: (calculateTotalNodes)
		// Actual connections / potential connections

	}

	function calculateNumConnectedComponents($data){

	}

	function calculateAvgNodesAndEdgesAcrossConnectedComponents($data){

	}

	function calculateAvgInDegree($data){

	}

	function calculateAvgOutDegree($data){

	}

	function calculateAvgDegree($data){

	}

	//Per Node Metrics
	function calculateInDegree($data){

	}

	function calculateOutDegree($data){

	}

	function calculateDegree($data){

	}

	function calculateBetweenessCentrality($data){

	}

	function calculateClosenessCentrality($data){

	}


?>
<?php

	$dbName = "/home/touellette/csc302-fa18-data/final-project.db";
	$dsn = "sqlite:$dbName";
	$dbh = null;

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

?>
<?php

	requre_once("model.html");

	function makeRoute($method, $pattern, $function){
		return[
			"method" => $method,
			"pattern" => $pattern,
			"controller" => $function
		];
	}

	requre_once("index.html");

?>
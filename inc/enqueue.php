<?php
function wb_register_style($name, $path, $version=PIY_VERSION, $deps=array(), $media='all') {
	if (!PIY_PAGESPEED) {
		$path = wb_add_query_param($path, 'ModPagespeed', 'off');
		$path = wb_add_query_param($path, 'cacheBust', (string) rand());
	}

	wp_register_style( $name, $path, array(), $version, $media );
}

function wb_register_lib($name, $path, $version, $deps=array(), $footer=true) {
	$src = PIY_LIB_DIR . $path . '.' . (PIY_USE_MIN?'min.js':'js');
	if (!PIY_PAGESPEED) {
		$src = wb_add_query_param($src, 'ModPagespeed', 'off');
		$src = wb_add_query_param($src, 'cacheBust', (string) rand());
	}
	wp_register_script( $name, $src, $deps, $version, $footer );
}

function wb_register_script($name, $path, $deps=array(), $version=PIY_VERSION, $footer=true) {
	$src = PIY_SCRIPTS_DIR . $path. '.' . (PIY_USE_MIN?'min.js':'js');
	if (!PIY_PAGESPEED) {
		$src = wb_add_query_param($src, 'ModPagespeed', 'off');
		$src = wb_add_query_param($src, 'cacheBust', (string) rand());
	}
	wp_register_script( $name, $src, $deps, $version, $footer );
}

function wb_enqueuer($type, $items) {
	foreach($items as $item) {
		if ($type == 'script') {
			wp_enqueue_script($item);
		} elseif ($type == 'style') {
			wp_enqueue_style($item);
		}
	}
}
?>
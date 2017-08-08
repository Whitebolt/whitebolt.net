<?php
function wb_add_excerpts_to_pages() {
	add_post_type_support( 'page', 'excerpt' );
}
add_action( 'init', 'wb_add_excerpts_to_pages' );


function wb_setup() {
	load_theme_textdomain( 'piy' );

	add_theme_support( 'post-thumbnails' );

	register_nav_menus( array(
		'main'    => __( 'Main Menu', 'whitebolt' ),
		'social' => __( 'Social Menu', 'whitebolt' )
	) );
}
add_action( 'after_setup_theme', 'wb_setup' );

function split_menu($menu_html, $middle_content) {
	$items = array_map(function($item){
		return '<li'.$item;
	}, explode('<li', $menu_html));
	$length = count($items) - 1;
	$balance = (floor($length / 2) + ($length % 2));
	array_splice($items, $balance+1, 0, '</ul>'.$middle_content.$items[0]);
	return str_replace('<li<ul', '<ul', implode('', $items));
}

function body_style($styles=array()) {
	$styles = apply_filters('body_style', $styles);
	if (!empty($styles)) {
		$html = ' style="';
		foreach($styles as $prop => $value) $html .= $prop . ': ' . $value . ';';
		echo $html . '"';
	}
	echo '';
}

function wb_get_background_image($id=null) {
	if (is_null($id)) $id = get_the_ID();
	$image_url  = get_post_meta($id, 'wpcf-background-image');
	if (empty($image_url)) {
		$image_url = get_theme_mod('default_background');
	} else {
		$image_url = array_shift($image_url);
	}
	return $image_url;
}

function wb_set_body_background_image($styles, $id=null) {
	$image_url  = wb_get_background_image($id);
	if (!empty($image_url)) $styles['background-image'] = 'url(\'' . $image_url . '\')';
	return $styles;
}
add_filter('body_style', 'wb_set_body_background_image', 10, 2);

function wb_set_body_cover_class($classes, $id=null) {
	if (!in_array('cover-image', $classes)) {
		$image_url = wb_get_background_image($id);
		if (!empty($image_url)) $classes[] = 'cover-image';
	}
	return $classes;
}
add_filter('rest_api_body_classes', 'wb_set_body_cover_class', 10, 2);
add_filter('body_class', 'wb_set_body_cover_class', 10, 2);
?>
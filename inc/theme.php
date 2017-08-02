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
?>
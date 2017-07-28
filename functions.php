<?php
require_once('inc/constants.php');
require_once('inc/helper.php');
require_once('inc/enqueue.php');
require_once('inc/customise.php');

function wb_enqueue() {
	wb_register_style('foundation', PIY_LIB_DIR . '/foundation-sites/dist/css/foundation-float.min.css', '6.3.1');
	wb_register_style('font-awesome', PIY_LIB_DIR . '/font-awesome/css/font-awesome.min.css');
	wb_register_style('main', PIY_DIR . '/style.css');

	wp_deregister_script( 'jquery' );
	wb_register_lib('jquery', '/jquery/dist/jquery', '3.1.1');
	wb_register_lib('what-input', '/what-input/dist/what-input', '4.0.6');
	wb_register_lib('foundation', '/foundation-sites/dist/js/foundation', '6.3.1', array('what-input'));
	wb_register_lib('angular', '/angular/angular', '1.6.5', array('jquery'));
	wb_register_script('wb', '/index', array('jquery', 'foundation', 'angular'));

	wb_enqueuer('style', array('foundation', 'font-awesome', 'main'));
	wb_enqueuer('script', array(
		'jquery',
		'what-input',
		'foundation',
		'angular',
		'wb'
	));
}
add_action( 'wp_enqueue_scripts', 'wb_enqueue' );

function wb_add_excerpts_to_pages() {
     add_post_type_support( 'page', 'excerpt' );
}
add_action( 'init', 'wb_add_excerpts_to_pages' );


function wb_setup() {
	load_theme_textdomain( 'piy' );

	add_theme_support( 'post-thumbnails' );

	register_nav_menus( array(
		'main-left'    => __( 'Main Menu Left', 'whitebolt' ),
		'main-right'    => __( 'Main Menu Right', 'whitebolt' ),
		'main'    => __( 'Main Menu', 'whitebolt' ),
		'social' => __( 'Social Menu', 'whitebolt' )
	) );
}
add_action( 'after_setup_theme', 'wb_setup' );

function be_header_menu_desc( $item_output, $item, $depth, $args ) {

	if($item->description )
		$item_output = str_replace( '<a', '<a description="' . $item->description . '" ', $item_output );

	return $item_output;
}
add_filter( 'walker_nav_menu_start_el', 'be_header_menu_desc', 10, 4 );

?>
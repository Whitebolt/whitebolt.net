<?php
require_once('inc/constants.php');
require_once('inc/helper.php');
require_once('inc/enqueue.php');
require_once('inc/customise.php');

function wb_enqueue() {
	wb_register_style('foundation', PIY_LIB_DIR . '/foundation-sites/dist/css/foundation.min.css', '6.3.1');
	wb_register_style('font-awesome', PIY_LIB_DIR . '/font-awesome/css/font-awesome.min.css');
	wb_register_style('main', PIY_DIR . '/style.css');

	wp_deregister_script( 'jquery' );
	wb_register_lib('jquery', '/jquery/dist/jquery', '3.1.1');
	wb_register_lib('what-input', '/what-input/dist/what-input', '4.0.6');
	wb_register_lib('foundation', '/foundation-sites/dist/js/foundation', '6.3.1', array('what-input'));
	wb_register_script('piy', '/index', array('jquery', 'foundation'));

	wb_enqueuer('style', array('foundation', 'font-awesome', 'featherlight', 'featherlight-gallery', 'main'));
	wb_enqueuer('script', array(
		'jquery',
		'what-input',
		'foundation',
		'piy'
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
		'top'    => __( 'Top Menu', 'piy' ),
		'terms' => __( 'Terms Menu', 'piy' ),
		'social' => __( 'Social Menu', 'piy' )
	) );
}
add_action( 'after_setup_theme', 'wb_setup' );

?>
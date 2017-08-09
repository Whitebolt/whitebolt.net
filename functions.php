<?php
require_once('inc/constants.php');
require_once('inc/helper.php');
require_once('inc/enqueue.php');
require_once('inc/annotate.php');
require_once('inc/customise.php');
require_once('inc/theme.php');

function wb_enqueue() {
	wb_register_style('foundation', PIY_LIB_DIR . '/foundation-sites/dist/css/foundation-float.min.css', '6.3.1');
	wb_register_style('font-awesome', PIY_LIB_DIR . '/font-awesome/css/font-awesome.min.css');
	wb_register_style('main', PIY_DIR . '/style.css', '0.0.2');

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
?>
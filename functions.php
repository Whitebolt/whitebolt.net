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

	wp_localize_script('wp-api', 'wpApiSettings', array(
		'root' => esc_url_raw( rest_url() ),
		'nonce' => wp_create_nonce( 'wp_rest' )
	));

	wb_enqueuer('style', array('foundation', 'font-awesome', 'main'));
	wb_enqueuer('script', array(
		'wp-api',
		'jquery',
		'what-input',
		'foundation',
		'angular',
		'wb'
	));
}
add_action( 'wp_enqueue_scripts', 'wb_enqueue' );

function wp_add_classes_to_api() {
	register_rest_field('page', 'body_classes', array(
		'get_callback' => function( $page ) {

			$classes = [];
			$classes[] = 'page-template-default';
			$classes[] = 'page';
			$classes[] = 'page-id-' . $page['id'];
			if (is_rtl()) $classes[] = 'rtl';
			if (is_user_logged_in()) $classes[] = 'logged-in';
			if ( is_admin_bar_showing() ) {
				$classes[] = 'admin-bar';
				$classes[] = 'no-customize-support';
			}

			$image_url  = get_post_meta($page['id'], 'wpcf-background-image');
			if (empty($image_url)) $image_url = get_theme_mod('default_background');
			if (!empty($image_url)) $classes[] = 'cover-image';

			return $classes;
		},
		'schema' => array(
			'description' => __( 'body classes' ),
			'type'        => 'array'
		)
	));
}
add_action( 'rest_api_init', 'wp_add_classes_to_api' );
?>
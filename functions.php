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

	wb_register_template('article', '/article.html', '0.0.1', array('angular'));

	$blog_slug = '/' . get_post_field( 'post_name', get_option( 'page_for_posts' )) . '/';
	if ((int) get_option( 'page_on_front' ) === (int) get_option( 'page_for_posts' )) $blog_slug = '/';


	wp_localize_script('wb', 'wpRestApiSettings', array(
		'nonce' => wp_create_nonce( 'wp_rest' ),
		'homepageId' => get_option( 'page_on_front' ),
		'homepageSlug' => '/',
		'blogSlug' => $blog_slug,
		'category_base' => empty(get_option( 'category_base' ))?'category':get_option( 'category_base' ),
		'tag_base' => empty(get_option( 'tag_base' ))?'post_tag':get_option( 'tag_base' )
	));

	wb_enqueuer('style', array('foundation', 'font-awesome', 'main'));
	wb_enqueuer('script', array(
		'jquery',
		'what-input',
		'foundation',
		'angular',
		'wb',
		'article.html'
	));
}
add_action( 'wp_enqueue_scripts', 'wb_enqueue' );

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

function wb_script_loader( $tag, $handle, $src ) {
	if (strstr($handle, '.html')) {
		$tag = str_replace( 'text/javascript', 'angular/template', $tag );
		$tag = str_replace( '<script', '<script id="'.$handle.'"', $tag );
	}
	return $tag;
}
add_filter( 'script_loader_tag', 'wb_script_loader', 10, 3 );

function wb_add_classes_to_api() {
	register_rest_field(['page', 'post'], 'body_class', array(
		'get_callback' => function( $data ) {
			$classes = [];

			FB::log($data['id']);
			FB::log(get_option('page_on_front'));

			if ($data['id'] === (int) get_option('page_on_front')) $classes[] = 'home';
			if ($data['type']) {
				$classes[] = $data['type'] . '-template-default';
				$classes[] = $data['type'];
				if ($data['id']) $classes[] = $data['type'] . '-id-' . $data['id'];
			}
			if (is_rtl()) $classes[] = 'rtl';
			$classes = apply_filters( 'rest_api_body_classes', array_merge(
				$classes,
				get_body_class()
			), $data['id']);

			FB::log($classes);

			return array_unique($classes);
		},
		'schema' => array(
			'description' => __( 'body classes' ),
			'type'        => 'array'
		)
	));

	register_rest_field(['page', 'post'], 'body_style', array(
		'get_callback' => function( $data ) {
			$styles = [];
			$styles = apply_filters( 'body_style', $styles, $data['id']);
			return array_unique($styles);
		},
		'schema' => array(
			'description' => __( 'body styles' ),
			'type'        => 'array'
		)
	));

	register_rest_field(['page', 'post'], 'post_class', array(
		'get_callback' => function( $data ) {
			return get_post_class('', $data['id']);
		},
		'schema' => array(
			'description' => __( 'post classes' ),
			'type'        => 'array'
		)
	));
}
add_action( 'rest_api_init', 'wb_add_classes_to_api' );
?>
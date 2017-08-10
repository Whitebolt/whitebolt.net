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

function main_style($styles=array()) {
	$styles = apply_filters('main_style', $styles);
	if (!empty($styles)) {
		$html = ' style="';
		foreach($styles as $prop => $value) $html .= $prop . ': ' . $value . ';';
		echo $html . '"';
	}
	echo '';
}

function main_class($classes=array()) {
	$classes = (is_array($classes) ? $classes : explode(' ', $classes));
	$classes = apply_filters( 'main_class', $classes );
	if (!empty( $classes )) echo ' class="' . str_replace('  ', ' ', implode( ' ', $classes )) . '"';
}

function wb_get_background_image($id=null) {
	if (is_null($id) || empty($id)) $id = get_the_ID();
	$image_url  = get_post_meta($id, 'wpcf-background-image');
	if (empty($image_url)) {
		$image_url = get_theme_mod('default_background');
	} else {
		$image_url = array_shift($image_url);
	}
	return $image_url;
}

function wb_set_main_background_image($styles, $id=null) {
	$image_url  = wb_get_background_image($id);
	if (!empty($image_url)) $styles['background-image'] = 'url(\'' . $image_url . '\')';

	return $styles;
}
add_filter('main_style', 'wb_set_main_background_image', 10, 2);

function wb_set_main_cover_class($classes, $id=null) {
	if (is_null($id) || empty($id)) $id = get_the_ID();
	if (!in_array('cover-image', $classes)) {
		$image_url = wb_get_background_image($id);
		if (!empty($image_url)) $classes[] = 'cover-image';
	}
	return $classes;
}
add_filter('main_class', 'wb_set_main_cover_class', 10, 2);

function wb_set_main_off_canvas_content($classes) {
	$classes[] = 'off-canvas-content';
	return $classes;
}
add_filter('main_class', 'wb_set_main_off_canvas_content', 10, 2);

function wb_set_body_class_index_page($classes, $id=null) {
	if (is_null($id) || empty($id)) {
		if ((is_front_page() && is_home()) || (!is_front_page() && is_home())) {
			$id = get_option( 'page_for_posts' );
		} else {
			$id = get_the_ID();
		}
	}

	if ($id && is_single()) {
		$post = get_post($id);
		$type = $post->post_type;

		if ($id === (int) get_option('page_on_front')) $classes[] = 'home';
		if ($id) {
			$classes[] = $type . '-template-default';
			$classes[] = $type;
			if ($id) $classes[] = $type . '-id-' . $id;
		}
	}

	if (is_rtl()) $classes[] = 'rtl';


	$classes = apply_filters( 'rest_api_body_classes', $classes, $id);

	return array_unique($classes);
}
add_filter('body_class', 'wb_set_body_class_index_page', 10, 3);
?>
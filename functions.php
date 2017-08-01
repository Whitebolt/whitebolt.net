<?php
require_once('inc/constants.php');
require_once('inc/helper.php');
require_once('inc/enqueue.php');
require_once('inc/customise.php');

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

function wb_alter_menu_item( $item_output, $item) {
	$excerpt = get_the_excerpt($item->object_id);
	$title = get_the_title($item->object_id);
	$attributes = array('ref-id'=>$item->object_id);

	$images = array_map(function($src) {
		$id = attachment_url_to_postid($src);
		$angle = get_post_meta($id, 'wpcf-angle');
		$distance = get_post_meta($id, 'wpcf-distance');
		$imgNodeData = wp_get_attachment_image_src($id, 'medium');

		return array(
			'src' => $imgNodeData[0],
			'width' => $imgNodeData[1],
			'height' => $imgNodeData[2],
			'angle'=>($angle?(int) $angle[0]:0),
			'distance'=>($distance?(int) $distance[0]:0)
		);
	}, get_post_meta($item->object_id, 'wpcf-homepage-icons'));

	if($excerpt) $attributes['description'] = $excerpt;
	if($item->description) $attributes['description'] = $item->description;
	if($title) $attributes['title'] = $title;
	if($item->attr_title) $attributes['title'] = $item->attr_title;
	if(count($images)) $attributes['logos'] = json_encode($images);

	foreach($attributes as $attribute => $value) {
		$item_output = str_replace('<a', '<a '.$attribute.'="'.str_replace('"', '&quot;', $value).'"', $item_output);
	}

	PC::debug($images);
	PC::debug($item);
	return $item_output;
}
add_filter( 'walker_nav_menu_start_el', 'wb_alter_menu_item', 10, 4 );

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
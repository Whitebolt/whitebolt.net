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

function split_menu($menu_html, $middle_content) {
	$items = array_map(function($item){
		return '<li'.$item;
	}, explode('<li', $menu_html));
	$length = count($items) - 1;
	$balance = (floor($length / 2) + ($length % 2));
	array_splice($items, $balance+1, 0, '</ul>'.$middle_content.$items[0]);
	return str_replace('<li<ul', '<ul', implode('', $items));
}


class WB_Slider_Menu extends Walker_Nav_Menu {
	public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
		if ( isset( $args->item_spacing ) && 'discard' === $args->item_spacing ) {
			$t = '';
			$n = '';
		} else {
			$t = "\t";
			$n = "\n";
		}
		$indent = ( $depth ) ? str_repeat( $t, $depth ) : '';

		$classes = empty( $item->classes ) ? array() : (array) $item->classes;
		$classes[] = 'menu-item-' . $item->ID;

		if (!in_array('no-annotation', $classes)) {
			$args = apply_filters( 'nav_menu_item_args', $args, $item, $depth );

			$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
			$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

			$id = apply_filters( 'nav_menu_item_id', 'menu-item-'. $item->ID, $item, $args, $depth );
			$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

			$output .= $indent . '<li' . $id . $class_names .'>';

			$excerpt = (($item->description) ? $item->description : get_the_excerpt($item->object_id));
			$title = (($item->attr_title) ? $item->attr_title : get_the_title($item->object_id));

			//$output .= '<div class="info">';
			$output .= '<h2>'.$title.'</h2>';
			$output .= $excerpt;
			//$output .= '</div>';
		}
	}

	public function end_el( &$output, $item, $depth = 0, $args = array() ) {
		$classes = empty( $item->classes ) ? array() : (array) $item->classes;
		$classes[] = 'menu-item-' . $item->ID;

		if (!in_array('no-annotation', $classes)) {
			if ( isset( $args->item_spacing ) && 'discard' === $args->item_spacing ) {
				$t = '';
				$n = '';
			} else {
				$t = "\t";
				$n = "\n";
			}
			$output .= "</li>{$n}";
		}
	}
}
?>
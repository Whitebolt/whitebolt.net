<?php
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

			$output .= $indent . '<article role="tab"' . $id . $class_names .'>';

			$excerpt = (($item->description) ? $item->description : get_the_excerpt($item->object_id));
			$title = (($item->attr_title) ? $item->attr_title : get_the_title($item->object_id));

			$output .= '<h2>'.$title.'</h2>';
			$output .= $excerpt;
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
			$output .= "</article>{$n}";
		}
	}
}
?>
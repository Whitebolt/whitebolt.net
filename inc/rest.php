<?php
function wb_add_classes_to_api() {
	register_rest_field(['page', 'post'], 'body_class', array(
		'get_callback' => function( $data ) {
			$classes = [];

			$classes = apply_filters( 'rest_api_body_classes', array_merge(
				$classes,
				get_body_class()
			), $data['id']);

			return array_unique($classes);
		},
		'schema' => array(
			'description' => __( 'body classes' ),
			'type'        => 'array'
		)
	));

	register_rest_field(['category'], 'body_class', array(
		'get_callback' => function( $data ) {
			$classes = [];

			$classes[] = 'archive';
			$classes[] = 'category';
			$classes[] = 'category-' . $data['id'];
			$classes[] = 'category-' . $data['slug'];

			$classes = array_merge($classes, get_body_class());

			return array_unique($classes);
		},
		'schema' => array(
			'description' => __( 'body classes' ),
			'type'        => 'array'
		)
	));

	register_rest_field(['page', 'post'], 'main_style', array(
		'get_callback' => function( $data ) {
			$styles = [];
			$styles = apply_filters( 'main_style', $styles, $data['id']);
			return array_unique($styles);
		},
		'schema' => array(
			'description' => __( 'main styles' ),
			'type'        => 'array'
		)
	));

	register_rest_field(['page', 'post'], 'main_class', array(
		'get_callback' => function( $data ) {
			$classes = [];
			$classes = apply_filters( 'main_class', $classes, $data['id']);
			return array_unique($classes);
		},
		'schema' => array(
			'description' => __( 'main classes' ),
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
<?php
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
<?php
function wb_customise($wp_customise) {
	$wp_customise->add_setting('telephone_contact');
	$wp_customise->add_setting('email_contact');
	$wp_customise->add_setting('google_analytics');

	$wp_customise->add_control(new WP_Customize_Control( $wp_customise, 'contact_telephone_number', array(
		'label' => 'Contact Number',
		'section' => 'title_tagline',
		'settings' => 'telephone_contact'
	)));
	$wp_customise->add_control(new WP_Customize_Control( $wp_customise, 'contact_email_address', array(
		'label' => 'Email',
		'section' => 'title_tagline',
		'settings' => 'email_contact'
	)));
	$wp_customise->add_control(new WP_Customize_Control( $wp_customise, 'google_analytics', array(
		'label' => 'Google Analytics Code',
		'section' => 'title_tagline',
		'settings' => 'google_analytics'
	)));
}
add_action('customize_register', 'wb_customise');

function wb_contact_number_shortcode( $atts ) {
	if (get_theme_mod( 'telephone_contact' )) {
		return get_theme_mod( 'telephone_contact' );
	} else {
		return "";
	}
}
add_shortcode( 'contact-no', 'wb_contact_number_shortcode' );

function wb_contact_email_shortcode( $atts ) {
	if (get_theme_mod( 'email_contact' )) {
		return '<a class="mailto" href="mailto:'.get_theme_mod( 'email_contact' ).'?">'.get_theme_mod( 'email_contact' ).'</a>';
	} else {
		return "";
	}
}
add_shortcode( 'contact-email', 'wb_contact_email_shortcode' );
?>
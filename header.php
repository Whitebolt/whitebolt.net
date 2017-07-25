<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js svg">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width">
	<base href="/">

	<title><?php if (!is_front_page()) {wp_title('');echo ' | ';} bloginfo('name'); ?></title>

	<meta name="theme-color" content="#646464">
	<meta name="msapplication-navbutton-color" content="#646464">
	<meta name="apple-mobile-web-app-status-bar-style" content="#646464">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

	<?php if (get_theme_mod( 'google_analytics' )) include_once("inc/analyticstracking.php"); ?>
	<?php wp_head(); ?>
</head>
<?php
	$image_url  = types_render_field( 'background-image', array('url' => true));
	$body_class = array();
	$body_style = '';
	if (!empty($image_url)) {
		$body_style .= 'background-image:url(\'' . $image_url . '\');';
		array_push($body_class, 'cover-image');
	}

	if (!empty($body_style)) $body_style = ' style="' . $body_style . '"';
?>

<body app="wb" <?php body_class($body_class); ?><?php echo $body_style; ?>>
<header>
	<?php if (is_home() || is_front_page()) { ?>
		<div class="logo">
			<h1>Whitebolt</h1>
			<p>...let the experts manage your site.</p>
		</div>

		<?php echo wp_nav_menu(array(
			'theme_location'  => 'main',
			'menu_class' => 'main-menu',
			'echo'            => true,
			'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
			'depth'           => 0
		));?>
	<?php } ?>
</header>
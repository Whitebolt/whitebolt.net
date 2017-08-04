<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js svg" style="margin:0 !important;" app="wb">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<base href="<?php echo get_home_url(); ?>/">

	<title bind-node="app.pageTitle"><?php if (!is_front_page()) {
			wp_title('');
			echo ' | ';
		}
		bloginfo('name');
	?></title>

	<meta name="theme-color" content="#646464">
	<meta name="msapplication-navbutton-color" content="#646464">
	<meta name="apple-mobile-web-app-status-bar-style" content="#646464">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

	<?php if (get_theme_mod( 'google_analytics' )) include_once("inc/analyticstracking.php"); ?>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); body_style();?>>
<header>
	<nav class="row">
		<?php
			echo split_menu(wp_nav_menu(array(
				'theme_location'  => 'main',
				'container'       => false,
				'menu_class'      => 'top-menu',
				'echo'            => false,
				'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
				'depth'           => 0
			)), '<div class="logo"><a href="'.get_home_url().'/">Whitebolt</a></div>');
		?>
	</nav>
</header>


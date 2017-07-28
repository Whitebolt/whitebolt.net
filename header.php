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
<header class="row">
	<nav>
		<?php
			echo split_menu(wp_nav_menu(array(
				'theme_location'  => 'main',
				'container'       => false,
				'menu_class'      => 'top-menu',
				'echo'            => false,
				'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
				'depth'           => 0
			)), '<div class="logo">Whitebolt</div>');
		?>
	</nav>
</header>
<nav class="homepage-nav">
	<?php if (is_home() || is_front_page()) { ?>
		<div class="menu-info">
			<h1 class="logo">Whitebolt</h1>
		</div>

		<img src="<?php echo get_template_directory_uri(); ?>/media/logos/mongodb.png" style="left:10%;top:30%" class="menu-logos bespoke" />
		<img src="<?php echo get_template_directory_uri(); ?>/media/logos/nodejs.png" style="right:5%;top:30%" class="menu-logos bespoke" />
		<img src="<?php echo get_template_directory_uri(); ?>/media/logos/postgressql.png" style="left:15%;bottom:5%" class="menu-logos bespoke" />

		<img src="<?php echo get_template_directory_uri(); ?>/media/logos/nginx.png" style="left:10%;top:30%" class="menu-logos hosting" />
		<img src="<?php echo get_template_directory_uri(); ?>/media/logos/php7.png" style="right:5%;top:20%;width:150px" class="menu-logos hosting" />
		<img src="<?php echo get_template_directory_uri(); ?>/media/logos/mariadb.png" style="left:15%;bottom:5%" class="menu-logos hosting" />

		<img src="<?php echo get_template_directory_uri(); ?>/media/logos/woocommerce.png" style="left:10%;top:30%" class="menu-logos website-design" />
		<img src="<?php echo get_template_directory_uri(); ?>/media/logos/wordpress.png" style="right:5%;top:30%" class="menu-logos website-design" />
	<?php } ?>
</nav>

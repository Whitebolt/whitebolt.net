<?php get_header(); ?>
<?php if (!is_home() && !is_front_page()) { ?>
	<main class="page">
		<?php while ( have_posts() ) : the_post(); ?>
			<article wordpress-loader id="content">
				<?php get_template_part('title'); ?>
				<?php the_content(); ?>
			</article>
		<?php endwhile; ?>
	</main>
<?php } else { ?>
	<?php wp_nav_menu(array(
		'theme_location'  => 'main',
		'container'       => false,
		'items_wrap'      => '<main id="%1$s" class="%2$s" annotate-menu=".top-menu">%3$s</main>',
		'depth'           => 0,
		'walker'          => new WB_Slider_Menu()
	)); ?>
<?php } ?>
<?php get_footer(); ?>

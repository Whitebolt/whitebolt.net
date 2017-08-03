<?php get_header(); ?>

<main>
	<?php if (is_home() || is_front_page()) { ?>
		<?php wp_nav_menu(array(
			'theme_location'  => 'main',
			'container'       => false,
			'items_wrap'      => '<div id="%1$s" class="%2$s" annotate-menu=".top-menu">%3$s</div>',
			'depth'           => 0,
			'walker'          => new WB_Slider_Menu()
		)); ?>
	<?php } ?>
	<div class="articles">
		<?php while ( have_posts() ) : the_post(); ?>
			<article class="page row">
				<?php get_template_part('title'); ?>
				<div bind-node="app.articleContent"><?php the_content(); ?></div>
			</article>
		<?php endwhile; ?>
	</div>
</main>
<?php get_footer(); ?>

<?php get_header(); ?>

<main>
	<?php wp_nav_menu(array(
		'theme_location'  => 'main',
		'container'       => false,
		'items_wrap'      => '<div id="%1$s" class="%2$s" annotate-menu=".top-menu">%3$s</div>',
		'depth'           => 0,
		'walker'          => new WB_Slider_Menu()
	)); ?>
	<?php
		$articlesClass = [];
		if ((is_front_page() && is_home()) || (!is_front_page() && is_home())) {
			$articlesClass = array_merge($articlesClass, get_post_class('', get_option( 'page_for_posts' )));
		} else {
			$articlesClass[] = 'articles-no-intro';
		}
		$articlesClass[] = 'articles';
		$articlesClass = implode(' ', array_unique($articlesClass));
	?>
	<div class="<?php echo $articlesClass; ?>" bind-node="app.articleNodes">
		<?php if ((is_front_page() && is_home()) || (!is_front_page() && is_home())) { ?>
			<?php get_template_part('title'); ?>
			<?php echo get_the_excerpt(get_option( 'page_for_posts' )); ?>
		<?php } ?>
		<?php while ( have_posts() ) : the_post(); ?>
			<?php get_template_part('article'); ?>
		<?php endwhile; ?>
	</div>
</main>
<?php get_footer(); ?>

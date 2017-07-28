<?php get_header(); ?>
	<main>
		<?php while ( have_posts() ) : the_post(); ?>
			<article wordpress-loader id="content">
				<?php get_template_part('title'); ?>
				<?php the_content(); ?>
			</article>
		<?php endwhile; ?>
	</main>
<?php get_footer();

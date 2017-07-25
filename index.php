<?php get_header(); ?>
	<!--main>
		<?php $hide_title = types_render_field( 'hide-title', array()); ?>
		<?php $count = 0; ?>
		<?php while ( have_posts() ) : the_post(); $count++;?>
			<article<?php echo ((($count === 1)) ? ' shift-content' : ''); ?> class="row medium-12 columns<?php echo (($count === 1) ? ' first' : ''); ?>">
				<div class="small-overlay show-for-small-only"></div>
				<?php get_template_part('title'); ?>
				<?php the_content(); ?>
			</article>
		<?php endwhile; ?>
	</main-->

	<article dynamic-loader="wordpressApi" id="content">
	</article>
<?php get_footer();

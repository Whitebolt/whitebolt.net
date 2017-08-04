<article class="<?php echo defined('ARTICLE_TEMPLATE_DONE') ? implode(' ', get_post_class()) : "{{post_class.join(' ')}}"; ?>">
	<?php get_template_part('title'); ?>
	<?php if (defined('ARTICLE_TEMPLATE_DONE')) {
		the_content();
	} else {
		echo '{{content}}';
	}?>
</article>
<?php if (!defined('ARTICLE_TEMPLATE_DONE')) define('ARTICLE_TEMPLATE_DONE', true); ?>
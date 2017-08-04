<?php global $hide_title; ?>
<?php if (($hide_title !== "1") && (!defined('TITLE_DONE')) || is_blog()) { ?>
	<h1>
		<?php if (defined('ARTICLE_TEMPLATE_DONE')) {
			if (defined('ARTICLES_TITLE_DONE')) {
				the_title();
			} else {
				single_post_title();
				define('ARTICLES_TITLE_DONE', true);
			}
		} else {
			echo '{{title}}';
		}?>
	</h1>
	<?php if (defined('ARTICLE_TEMPLATE_DONE') && !defined('TITLE_DONE')) define('TITLE_DONE', true); ?>
<?php } ?>
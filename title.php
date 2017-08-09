<?php global $hide_title; ?>
<?php if (($hide_title != "1") && (!defined('TITLE_DONE')) || is_blog()) { ?>
	<h1><?php the_title(); ?></h1>
	<?php if (!defined('TITLE_DONE')) define('TITLE_DONE', true); ?>
<?php } ?>
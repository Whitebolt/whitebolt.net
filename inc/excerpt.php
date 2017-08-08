<?php
/**
 * @package wp-wysiwyg-excerpt
 * This class removes the default excerpt metabox and adds a new box with the wysiwyg editor capability
 *
 * @ref https://gist.github.com/davidbenton/3658171
 * @author etessore
 * @author ssimpo
 */

/**
 * This class removes the default excerpt metabox
 * and adds a new box with the wysiwyg editor capability
 * @author etessore
 */
class TinyMceExcerptCustomization{
	const textdomain = '';
	const custom_excerpt_slug = '_custom-excerpt';
	var $contexts;

	/**
	 * Set the feature up
	 * @param array $contexts a list of context where you want the wysiwyg editor in the excerpt field. Default array('post','page')
	 */
	function __construct($contexts=array('post', 'page')){

		$this->contexts = $contexts;

		add_action('admin_menu', array($this, 'remove_excerpt_metabox'));
		add_action('add_meta_boxes', array($this, 'add_tinymce_to_excerpt_metabox'));
		add_filter('wp_trim_excerpt',  array($this, 'custom_trim_excerpt'), 10, 2);
		add_action('save_post', array($this, 'save_box'));
	}

	/**
	 * Removes the default editor for the excerpt
	 */
	function remove_excerpt_metabox(){
		foreach($this->contexts as $context)
			remove_meta_box('postexcerpt', $context, 'normal');
	}

	/**
	 * Adds a new excerpt editor with the wysiwyg editor
	 */
	function add_tinymce_to_excerpt_metabox(){
		foreach($this->contexts as $context)
			add_meta_box(
				'tinymce-excerpt',
				__('Excerpt', self::textdomain),
				array($this, 'tinymce_excerpt_box'),
				$context,
				'normal',
				'high'
			);
	}

	/**
	 * Manages the excerpt escaping process
	 * @param string $text the default filtered version
	 * @param string $raw_excerpt the raw version
	 */
	function custom_trim_excerpt($text, $raw_excerpt) {
		global $post;
		$custom_excerpt = get_post_meta($post->ID, self::custom_excerpt_slug, true);
		if(empty($custom_excerpt)) return $text;
		$custom_excerpt = do_shortcode($custom_excerpt);
		return $custom_excerpt;
	}

	/**
	 * Prints the markup for the tinymce excerpt box
	 * @param object $post the post object
	 */
	function tinymce_excerpt_box($post){
		$content = html_entity_decode($post->post_excerpt);
		if(empty($content)) $content = '';
		wp_editor(
			$content,
			self::custom_excerpt_slug,
			array(
				'wpautop'		=>	true,
				'media_buttons'	=>	true,
				'textarea_rows'	=>	10,
				'textarea_name'	=>	self::custom_excerpt_slug
			)
		);
	}

	/**
	 * Called when the post is being saved
	 * @param int $post_id the post id
	 */
	function save_box($post_id){
		if (isset($_POST[self::custom_excerpt_slug])) {
			$the_post = get_post($post_id);
			$the_post->post_excerpt = wp_kses_post( $_POST[self::custom_excerpt_slug]);
			// NB: You might want to use wp_make_content_images_responsive() when displaying your excerpt
			remove_action('save_post', array($this,'save_box'));
			wp_update_post( $the_post );
			add_action('save_post', array($this, 'save_box'));
		}
	}
}

global $tinymce_excerpt;
$tinymce_excerpt = new TinyMceExcerptCustomization();
?>
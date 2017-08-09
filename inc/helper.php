<?php
	function wb_add_query_param($url, $key, $value) {
		$query = parse_url($url, PHP_URL_QUERY);
		$url .= ($query?'&':'?');
		return $url . $key.'='.$value;
	}

	function is_blog() {
		global  $post;
		$posttype = get_post_type($post );
		return ( ((is_archive()) || (is_author()) || (is_category()) || (is_home()) || (is_single()) || (is_tag())) && ( $posttype == 'post')  ) ? true : false ;
	}
?>
<?php
/*
Plugin Name: Custom Email Notification
Description: Sends email to user after submitting a new post.
Author: Nazmul
Version: 1.0
*/


remove_filter( 'the_excerpt', 'wpautop' );
remove_filter( 'the_content', 'wpautop' );
add_action('wp_insert_post', 'send_email_after_post_creation', 10, 3);

function send_email_after_post_creation($post_ID, $post, $update) {
    // Check if the post is being created (not updated)
    if (!$update) {
        // Get the user's email based on the post author's ID
        $author_id = $post->post_author;
        $author_email = get_the_author_meta('user_email', $author_id);

        // Email subject and message
    
        $subject = 'New Post Notification';
        $message = 'A new post has been submitted on your website.';

        // Send the email
        wp_mail($author_email, $subject, $message);
    }
}


add_action('rest_api_init', function () {
    register_rest_route('custom-post-submitter/v1', 'submit-post', array(
        'methods' => 'POST',
        'callback' => 'custom_post_submitter_rest_submit_post',
    ));
});



// custom post
function custom_post_submitter_rest_submit_post($request) {
    $data = $request->get_json_params();

    if (isset($data['title']) && isset($data['content'])) {
        $title = sanitize_text_field($data['title']);
        $content = wp_kses_post($data['content']);

        if (custom_post_submitter_submit_post($title, $content)) {
            return array('success' => true);
        }
    }

    return array('success' => false);
}


//get req
function custom_rest_get_handle_request($request) {
    $user_id = $request->get_param('user_id'); 

   
    $args = array(
        'author' => $user_id,
        'post_status' => 'publish',
        'posts_per_page' => -1, // Retrieve all posts
    );

    $posts_query = new WP_Query($args);
    $posts = $posts_query->get_posts();


    $post_data = array();
    foreach ($posts as $post) {
        $post_data[] = array(
            'title' => $post->post_title,
            'content' => $post->post_content,
          
        );
    }


    return new WP_REST_Response($post_data, 200);
}

add_action('rest_api_init', function () {
    register_rest_route('custom-rest-get-plugin/v1', 'get-posts/(?P<user_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'custom_rest_get_handle_request',
    ));
});


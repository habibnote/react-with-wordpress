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


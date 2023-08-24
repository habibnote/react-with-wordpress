<?php
/*
 * Plugin Name:       React Wordpress Plugin 
 * Plugin URI:        https://me.habibnote.com
 * Description:       Create a new post with ajax and notifiy to the author with his email.
 * Version:           0.0.1
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Md. Habibur Rahman
 * Author URI:        https://me.habibnote.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:        https://example.com/my-plugin/
 * Text Domain:       express-post-creator
*/

if( ! defined( 'ABSPATH' ) ) {
    exit;
}

remove_filter( 'the_excerpt', 'wpautop' );
remove_filter( 'the_content', 'wpautop' );

add_action( 'rest_api_init', function() {
    register_rest_field( 'post', 'featured_src', [
        'get_callback' => 'imgGetFeaturedImgSrc',
    ] );
} );

function imgGetFeaturedImgSrc($obj, $fieldName, $request){
    if( $obj['featured_media'] ) {
        $img = wp_get_attachment_image_src( $obj['featured_media'], 'full' );
        return $img[0];
    }

    return false;
}

function mod_jwt_auth_token_before_dispatch( $data, $user ) {
    $user_info = get_user_by( 'email',  $user->data->user_email );
    $profile = array (
        'id'                => $user_info->id,
        'user_first_name'   => $user_info->first_name,
        'user_last_name'    => $user_info->last_name,
        'user_email'        => $user->data->user_email,
        'user_nicename'     => $user->data->user_nicename,
        'user_display_name' => $user->data->display_name,
        'phone'             => get_field( 'phone', "user_$user_info->id" ) // you also can get ACF fields
    );
    $response = array(
        'token' => $data['token'],
        'profile' => $profile
    );
    return $response;
}
add_filter( 'jwt_auth_token_before_dispatch', 'mod_jwt_auth_token_before_dispatch', 10, 2 );

add_action( 'wp_insert_post', 'send_mail_when_creted_new_post' );

function send_mail_when_creted_new_post( $post_id ) {
    $post = get_post( $post_id );
    $permalink = get_permalink( $post_id );
    if ($post) {
        $author_id = $post->post_author;
        $author    = get_user_by('ID', $author_id);
        if ($author) {
            $to_add        = $author->user_email;
            $subject       = 'Congratulations New Post Creadted';
            $post_url      = sprintf( '<a href="%s">View Post</a>', $permalink );
            $message       = sprintf( 'Congratulations! A new post has been inserted Successfully! You can see from here = %s',  $post_url );
            wp_mail( $to_add , $subject, $message );
        }
    }
}

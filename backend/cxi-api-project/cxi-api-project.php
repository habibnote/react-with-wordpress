<?php 
/*
 * Plugin Name:       CXI API Project
 * Plugin URI:        https://me.habibnote.com
 * Description:       Handle the basics with this plugin.
 * Version:           0.0.1
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Md. Habib
 * Author URI:        https://me.habibnote.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:        https://example.com/my-plugin/
 * Text Domain:       cxi-project-api
 * Domain Path:       /languages
*/

if( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * The Main Plugin Class
 */
class CXI_Api_Project {

    /**
     * Class constructor
     */
    function __construct() {
        add_action( 'rest_api_init', [$this, 'CXI_custom_login_init'] );
        add_action( 'wp_insert_post', [ $this, 'CXI_send_email_after_post_insert' ] );
    }

    /**
     * Register Custom Route
     */
    public function CXI_custom_login_init(){
        register_rest_route('custom-login-api/v1', '/login', array(
            'methods' => 'POST',
            'callback' => [$this, 'CXI_custom_login_api_callback'],
        ));

        register_rest_route('custom-login-api/v1', '/nonce', array(
            'methods' => 'GET',
            'callback' => [$this, 'CXI_custom_login_api_callback_nonce'],
        ));

        register_rest_route('custom-post/v1', '/create-post', array(
            'methods' => 'POST',
            'callback' => [$this, 'CXI_custom_post_creator'],
        ));

        register_rest_route( 'custom-post/v1', '/posts/(?P<author_id>\d+)', array(
            'methods'  => 'GET',
            'callback' => [ $this, 'CXI_get_posts_by_author_id' ]
        ));
    }

    /**
     * Callback for Geting post by author ID
     */
    function CXI_get_posts_by_author_id( $request ) {
        $author_id = $request->get_param( 'author_id' );
        if ( empty( $author_id ) ) {
            return new WP_Error( 'empty_author_id', 'Author ID is required.', array( 'status' => 400 ) );
        }
        $args = array(
            'post_type'         => 'post',
            'author'            => $author_id,
            'posts_per_page'    => -1,
        );
        $posts = get_posts( $args );
        $formatted_posts = array();
        foreach ( $posts as $post ) {
            $formatted_posts[] = array(
                'id'        => $post->ID,
                'title'     => $post->post_title,
                'content'   => $post->post_content
            );
        }
        return $formatted_posts;
    }

    /**
     * Callboack for create post
     */
    function CXI_custom_post_creator( $request ) {
        $post_data = $request->get_json_params();
        
        $nonce_value    = sanitize_text_field( $post_data['nonce_value']) ;
        $nonce_action   = sanitize_text_field( $post_data['nonce_action'] );
        $title          = sanitize_text_field( $post_data['post_title']) ;
        $content        = wp_kses_post( $post_data['post_content'] );
        $author_id      = sanitize_text_field( $post_data['author_id'] );

        
        if( ! empty( $nonce_value ) && wp_verify_nonce( $nonce_value, $nonce_action ) ){
            
            $CXI_post = array(
                'post_title'    => $title,
                'post_content'  => $content,
                'post_status'   => 'publish',
                'post_author'   => $author_id,
                'post_type'     => 'post'
            );

            $new_post_id = wp_insert_post( $CXI_post ); //creating new post and get post id 

            if( $new_post_id ){
                return "Post has been created";
            }

        }else{
            return "Something is wrong! Pelase try again";
        }
    }

    /**
     * Callback for nonce
     */
    function CXI_custom_login_api_callback_nonce() {
        $nonce_action = 'custom_login_nonce';
        return array(
            'nonce_action'  => $nonce_action,
            'nonce_value'   =>  wp_create_nonce( $nonce_action )
        );
    }

    /**
     * Exicute api callback function
     */
    function CXI_custom_login_api_callback( $request ) {
        $data = $request->get_json_params();
        
        $nonce_value    = sanitize_text_field( $data['nonce_value']) ;
        $nonce_action   = sanitize_text_field( $data['nonce_action'] );
        $username       = sanitize_text_field( $data['username'] );
        $password       = sanitize_text_field( $data['password'] );
        
        $user = wp_authenticate($username, $password);
        
        if (is_wp_error($user)) {
            return array(
                'success' => false,
                'message' => __('Invalid username or password.', 'cxi-project-api'),
            );
        } else {

            if( ! empty( $nonce_value ) && wp_verify_nonce( $nonce_value, $nonce_action ) ){

                wp_set_current_user($user->ID);
                wp_set_auth_cookie($user->ID);
                
                return array(
                    'author_id'     => $user->ID,
                    'success'       => true,
                    'message'       => __('User logged in successfully.', 'cxi-project-api'),
                );
            }else{
                return array(
                    'success' => false,
                    'message' => __('Invalid username or password.', 'cxi-project-api'),
                );
            }

        }
    }

     /**
     * Send Email After createing new Post
     */
    function CXI_send_email_after_post_insert( $post_id ) {
        $post       = get_post( $post_id );
        $permalink  = get_permalink( $post_id );

        if ( $post ) {
            $author_id = $post->post_author;
            $author    = get_user_by( 'ID', $author_id );
            if ( $author ) {
                $email   = $author->user_email;
                $to      = $email;
                $subject = 'New Post Inserted';
                $post_url = sprintf( 'You can see your post by clicking this link : <a href="%s">%s</a>', $permalink, 'Click here');
                $message = '<h1>Congratulations!</h1> <h4>A new post has been inserted Successfully!</h4> <br> <h2>' . $post->post_title . '</h2><br>' . $post_url;
                //Sent mail
                wp_mail( $to, $subject, $message );
            }
        }
    }
}

//Kick off the plugin
new CXI_Api_Project();
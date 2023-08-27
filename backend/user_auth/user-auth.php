<?php 
/*
 * Plugin Name:       User Login Auth
 * Description:       Handle the basics with this plugin.
 * Version:           0.0.1
*/

if( ! defined( 'ABSPATH' ) ) {
    exit;
}

class User {

    /**
     * Class constructor
     */
    function __construct() {
        add_action( 'rest_api_init', [$this, 'ULA_custom_login_init'] );
    }

    /**
     * Register Custom Route
     */
    public function ULA_custom_login_init(){
        register_rest_route('custom-login-api/v1', '/login', array(
            'methods' => 'POST',
            'callback' => [$this, 'ULA_custom_login_api_callback'],
        ));

        register_rest_route('custom-login-api/v1', '/nonce', array(
            'methods' => 'GET',
            'callback' => [$this, 'ULA_custom_login_api_callback_nonce'],
        ));

        register_rest_route('custom-post/v1', '/create-post', array(
            'methods' => 'POST',
            'callback' => [$this, 'ULA_custom_post_creator'],
        ));
    }

    /**
     * Callboack for create post
     */
    function ULA_custom_post_creator($request) {
        $post_data = $request->get_json_params();
        
        $nonce_value    = sanitize_text_field( $post_data['nonce_value']) ;
        $nonce_action   = sanitize_text_field( $post_data['nonce_action'] );
        $title          = sanitize_text_field( $post_data['post_title']) ;
        $content        = wp_kses_post($post_data['post_content']);
        $author_id      = sanitize_text_field( $post_data['author_id'] );
        update_option("hit from auth","auth"); 
        update_option("updated title",$title);       
        update_option("updated content",$content);
        
        if( ! empty( $nonce_value ) && wp_verify_nonce( $nonce_value, $nonce_action ) ){
        
            $ULA_post = array(
                'post_title'    => $title,
                'post_content'  => $content,
                'post_status'   => 'publish',
                'post_author'   => $author_id,
                'post_type'     => 'post'
            );

            $new_post_id = wp_insert_post( $ULA_post ); //creating new post and get post id 

            if($new_post_id){
                return "Post has been created";
            }

        }else{
            return "Something is wrong! Pelase try again";
        }
    }

    /**
     * Callback for nonce
     */
    function ULA_custom_login_api_callback_nonce() {
        $nonce_action = 'custom_login_nonce';
        return array(
            'nonce_action'  => $nonce_action,
            'nonce_value'   =>  wp_create_nonce( $nonce_action )
        );
    }

    /**
     * Exicute api callback function
     */
    function ULA_custom_login_api_callback($request) {
        $data = $request->get_json_params();
        
        $nonce_value    = sanitize_text_field( $data['nonce_value']) ;
        $nonce_action   = sanitize_text_field( $data['nonce_action'] );
        $username       = sanitize_text_field( $data['username'] );
        $password       = sanitize_text_field( $data['password'] );
        
        $user = wp_authenticate($username, $password);
        
        if (is_wp_error($user)) {
            return array(
                'success' => false,
                'message' => __('Invalid username or password.', 'user-l-a'),
            );
        } else {

            if( ! empty( $nonce_value ) && wp_verify_nonce( $nonce_value, $nonce_action ) ){

                wp_set_current_user($user->ID);
                wp_set_auth_cookie($user->ID);
                
                return array(
                    'author_id'     => $user->ID,
                    'success'       => true,
                    'message'       => __('User logged in successfully.', 'user-l-a'),
                );
            }else{
                return array(
                    'success' => false,
                    'message' => __('Invalid username or password.', 'user-l-a'),
                );
            }

        }
    }
}

// get post
function custom_rest_get_handle_request($request) {
    $user_id = $request->get_param('user_id'); // Get the user ID from the URL parameter

    // Query posts based on the author ID (user ID)
    $args = array(
        'author' => $user_id,
        'post_status' => 'publish',
        'posts_per_page' => -1, // Retrieve all posts
    );

    $posts_query = new WP_Query($args);
    $posts = $posts_query->get_posts();

    // Create an array to store post data
    $post_data = array();
    foreach ($posts as $post) {
        $post_data[] = array(
            'title' => $post->post_title,
            'content' => $post->post_content,
            // You can include more post data here
        );
    }

    // Return the array of post data
    return new WP_REST_Response($post_data, 200);
}
// phpinfo();
// echo nl2br(file_get_contents('/path/to/php_error_log'));
add_action('rest_api_init', function () {
    register_rest_route('custom-rest-get-plugin/v1', 'get-posts/(?P<user_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'custom_rest_get_handle_request',
    ));
});


new User();
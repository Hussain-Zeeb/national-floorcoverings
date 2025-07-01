<?php
/**
 * Theme functions and definitions
 *
 * @package HelloElementorChild
 */

/**
 * Load child theme css and optional scripts
 *
 * @return void
 */

function hello_elementor_child_enqueue_scripts() {
  // Get file paths
  $style_path = get_stylesheet_directory() . '/style.css';
  $script_path = get_stylesheet_directory() . '/js/scripts.js';
  $main_style_path = get_stylesheet_directory() . '/css/main.css';

  // Enqueue child theme style
  wp_enqueue_style(
      'hello-elementor-child-style',
      get_stylesheet_directory_uri() . '/style.css',
      ['hello-elementor-theme-style'],
      file_exists($style_path) ? filemtime($style_path) : '1.0.0'
  );

        // Enqueue GSAP and ScrollTrigger
        wp_enqueue_script(
            'gsap',
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js',
            array(),
            '3.13.0',
            true
        );
        
        wp_enqueue_script(
            'gsap-scrolltrigger',
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js',
            array('gsap'),
            '3.13.0',
            true
        );

        wp_enqueue_script(
            'gsap-scrollsmoother',
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollSmoother.min.js',
            array('gsap', 'gsap-scrolltrigger'),
            '3.13.0',
            true
        );

  // Enqueue custom scripts
wp_enqueue_script(
    'custom-scripts',
    get_stylesheet_directory_uri() . '/js/scripts.js',
    ['jquery', 'gsap', 'gsap-scrolltrigger', 'gsap-scrollsmoother'], // Add dependencies
    file_exists($script_path) ? filemtime($script_path) : '1.0.9',
    true
);


  // Enqueue main style
  wp_enqueue_style(
      'custom-main-style',
      get_stylesheet_directory_uri() . '/css/main.css',
      [],
      file_exists($main_style_path) ? filemtime($main_style_path) : '1.0.0'
  );


  // Enqueue Lightbox2 assets
  wp_enqueue_style(
        'lightbox-css',
        'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/css/lightbox.min.css',
        [],
        '2.11.3'
  );

  wp_enqueue_script(
        'lightbox-js',
        'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js',
        ['jquery'],
        '2.11.3',
        true
  );

}
add_action('wp_enqueue_scripts', 'hello_elementor_child_enqueue_scripts');




// Accept SVG ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

add_filter( 'wp_check_filetype_and_ext', function($data, $file, $filename, $mimes) {
    global $wp_version;
    if ( $wp_version !== '4.7.1' ) {
       return $data;
    }
    $filetype = wp_check_filetype( $filename, $mimes );
    return [
        'ext'             => $filetype['ext'],
        'type'            => $filetype['type'],
        'proper_filename' => $data['proper_filename']
    ];
  }, 10, 4 );
  function cc_mime_types( $mimes ){
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
  }
  add_filter( 'upload_mimes', 'cc_mime_types' );
  function fix_svg() {
    echo '';
  }
  add_action( 'admin_head', 'fix_svg' );




// Add ScrollSmoother wrapper structure ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Add ScrollSmoother wrapper structure
function add_smooth_wrapper_start() {
    echo '<div id="smooth-wrapper"><div id="smooth-content">';
}
function add_smooth_wrapper_end() {
    echo '</div></div>';
}

// For standard Elementor pages
add_action('elementor/theme/before_do_header', 'add_smooth_wrapper_start', 5);
add_action('elementor/theme/after_do_footer', 'add_smooth_wrapper_end', 5);

// For Elementor Canvas template
add_action('elementor/page_templates/canvas/before_content', 'add_smooth_wrapper_start');
add_action('elementor/page_templates/canvas/after_content', 'add_smooth_wrapper_end');






// Pinned Sections Template Part Integration ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Shortcode to display sections template part
 * Usage: [display_sections] or [display_sections category="innovation" limit="5"]
 */

function display_sections_shortcode($atts) {
    $atts = shortcode_atts(array(
        'category' => '',
        'limit' => -1,
        'order' => 'ASC',
        'orderby' => 'menu_order'
    ), $atts);
    
    // Store original query
    global $wp_query;
    $original_query = $wp_query;
    
    // Setup custom query args - Remove the featured image requirement
    $query_args = array(
        'post_type' => 'section',
        'post_status' => 'publish',
        'posts_per_page' => intval($atts['limit']),
        'orderby' => $atts['orderby'],
        'order' => $atts['order']
    );
    
    // Add category filter if specified
    if (!empty($atts['category'])) {
        $query_args['meta_query'] = array(
            array(
                'key' => 'section_category',
                'value' => $atts['category'],
                'compare' => 'LIKE'
            )
        );
    }
    
    // Set global query for template part
    $wp_query = new WP_Query($query_args);
    
    // Capture output
    ob_start();
    get_template_part('template-parts/sections', 'display');
    $output = ob_get_clean();
    
    // Restore original query
    wp_reset_postdata();
    $wp_query = $original_query;
    
    return $output;
}
add_shortcode('display_sections', 'display_sections_shortcode');

/**
 * Helper function to include sections template part in PHP
 * Usage: display_sections_template(); or display_sections_template('innovation', 5);
 */
function display_sections_template($category = '', $limit = -1) {
    echo display_sections_shortcode(array(
        'category' => $category,
        'limit' => $limit
    ));
}



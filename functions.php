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

  // Enqueue custom scripts
  wp_enqueue_script(
      'custom-scripts',
      get_stylesheet_directory_uri() . '/js/scripts.js',
      ['jquery'],
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

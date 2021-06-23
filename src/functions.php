function load_resource_page() {
  if( is_page(15) ) {
    wp_enqueue_script('resource-library-script', get_template_directory_uri() . '/js/index.js', array(), false, true);
  }
}

add_action('wp_enqueue_scripts', 'load_resource_page');

function add_type_module_attribute($tag, $handle, $src) {
    // if not your script, do nothing and return original $tag
    if ( 'resource-library-script' !== $handle ) {
        return $tag;
    }
    // change the script tag by adding type="module" and return it.
    $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
    return $tag;
}


add_filter('script_loader_tag', 'add_type_module_attribute' , 10, 3);

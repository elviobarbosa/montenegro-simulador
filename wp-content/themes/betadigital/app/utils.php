<?php
/**
 * Load Utils.
 *
 * 
 */

$theme_dir = __DIR__ ;
$scan_dir = $theme_dir . '/utils/';
$files = scandir($scan_dir);

foreach ($files as &$file) {
    if ( is_file( $scan_dir . $file ) ):
        require_once $scan_dir . $file;
    endif;
}

function number_format_brl($number){
    return 'R$ ' . number_format($number, 2, ',', '.');
}
//GET SVG FILE
function get_excerpt($agLimit, $agID, $agSource = null){
    $excerpt = $agSource == "content" ? get_the_content($agID) : get_the_excerpt($agID);
    $excerpt = preg_replace(" (\[.*?\])",'',$excerpt);
    $excerpt = strip_shortcodes($excerpt);
    $excerpt = strip_tags($excerpt);
    $excerpt = substr($excerpt, 0, $agLimit);
    $excerpt = substr($excerpt, 0, strripos($excerpt, " "));
    $excerpt = trim(preg_replace( '/\s+/', ' ', $excerpt));
    $excerpt = $excerpt.'...';
    return $excerpt;
}

function limit_words($string, $limit) {
    $words = explode(" ", $string);
    $string = str_replace(array("\r\n", "\r", "\n"), "<br>", $string);
    return $string;
}


// SOCIAL SHARE
function shareSocial($network) {
    switch ($network) {
        case "facebook":
            $url = "https://www.facebook.com/sharer/sharer.php?u=" . get_permalink();
            break;
        case "x":
            $url = "https://x.com/intent/post?text=" . get_the_title() . "&amp;url=" . get_permalink();
            break;
        case "linkedin":
            $url = "https://www.linkedin.com/cws/share?url=" . get_permalink();
            break;
        case "whatsapp":
            $url = "https://api.whatsapp.com/send?text=" . get_permalink();
            break;
        case "telegram":
            $url = "https://telegram.me/share/url?url=" . get_permalink();
            break;
        
    }
    return $url .'" onClick="javascript:window.open(this.href,\'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;';
}

// CONTACT FORM
// add_filter( 'shortcode_atts_wpcf7', 'custom_shortcode_atts_wpcf7_filter', 10, 3 );
 
// function custom_shortcode_atts_wpcf7_filter( $out, $pairs, $atts ) {
//   $my_attr = 'user-id';
 
//   if ( isset( $atts[$my_attr] ) ) {
//     $out[$my_attr] = $atts[$my_attr];
//   }
 
//   return $out;
// }


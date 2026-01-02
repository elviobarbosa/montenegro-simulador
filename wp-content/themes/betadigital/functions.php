<?php
require_once 'app/admin.php';
require_once 'app/config.php';
// require_once 'app/blocks.php';
require_once 'app/utils.php';
require_once 'app/ajax.php';
// require_once 'app/acf-blocks/config.php';
require_once 'app/enqueue.php';
require_once 'app/cpt.php';
require_once 'template-parts/components/button.php';
// add_filter('mec_activation_import_events', '__return_false');
// add_action( 'wp_enqueue_scripts', 'grand_sunrise_enqueue_styles' );

// function grand_sunrise_enqueue_styles() {
// 	wp_enqueue_style( 
// 		'grand-sunrise-style', 
// 		get_stylesheet_uri()
// 	);
// }



define("URLTEMA", get_bloginfo("template_url"));
define("RESOURCES", get_bloginfo("template_url") . "/resources/");
define("IMGPATH", get_bloginfo("template_url") . "/dist/images/bmp/");
define("SVGPATH", get_stylesheet_directory_uri() . "/dist/images/svg/sprite.svg#");
define("WHASTSAPP", '(85) 99194-2140');
define("WHATSAPP_LINK", 'https://api.whatsapp.com/send?phone=5585991942140&text=Olá estou intressado em um imóvel, você pode me ajudar?');
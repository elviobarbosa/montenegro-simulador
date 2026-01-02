<!doctype html>
<html>
<head>
	<?php
	// if('post_empreendimentos' != get_post_type() ){
	// 	add_action( 'wpcf7_enqueue_styles', function() { wp_deregister_style( 'contact-form-7' ); } );
	// 	add_action( 'wpcf7_enqueue_scripts', function() { wp_deregister_script( 'jquery-form' ); } );
	// 	add_action( 'wpcf7_enqueue_scripts', function() { wp_deregister_script( 'contact-form-7' ); } );
	// }
	//$body_class = (is_search()) ? 'search-page' : '';
	?>
	
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name=viewport content="width=device-width">
	<meta charset="UTF-8">
	<title><?php wp_title();?></title>
	<link rel="shortcut icon" href="<?php bloginfo('wpurl');?>/favicon.ico" />

	<?php wp_head() ?>

</head>

<body <?php body_class() ?>>

	<div class="nav-container">
	<div class="container nav-container__container">
		<?php 
			get_template_part('template-parts/headers/header-primary');
		?>
	</div>
</div>


<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width">
	<meta charset="UTF-8">
	<title><?php wp_title(); ?></title>
	<link rel="shortcut icon" href="<?php bloginfo('wpurl'); ?>/favicon.ico" />
	<?php wp_head(); ?>
</head>

<body <?php body_class('terrenos-lotes-body'); ?>>

<?php
// Define SVGPATH para o plugin
if (!defined('SVGPATH')) {
    define('SVGPATH', plugin_dir_url(dirname(__FILE__)) . 'assets/images/svg/sprite.svg#');
}
?>

<div class="nav-container">
	<div class="container nav-container__container">
		<div class="nav-container__wrapper nav-container--primary">
			<h3>
				<svg role="img" aria-labelledby="logo-title">
					<title id="logo-title">Montenegro Urbanismo</title>
					<use href="<?php echo SVGPATH ?>marca-montenegro"></use>
				</svg>
				<span class="sr-only">Montenegro Urbanismo</span>
			</h3>
		</div>
	</div>
</div>

<main class="terrenos-lotes-main">

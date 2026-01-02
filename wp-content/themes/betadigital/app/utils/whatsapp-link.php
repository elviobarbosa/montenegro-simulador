<?php
function whatsapp_link( $cell_number, $text ) {
    $number = format_wapp_number($cell_number);
    echo "https://api.whatsapp.com/send?phone={$number}&text={$text}";
}

function format_wapp_number( $cell_number ) {
    return preg_replace( '/[^0-9]/', '', $cell_number );
}
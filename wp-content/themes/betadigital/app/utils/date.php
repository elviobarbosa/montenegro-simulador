<?php
function ptBR_date($date) {
    $date = strtotime($date);
    $days = array("Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado");
    $months = array("jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez");
    $day_week = $days[date('w', $date)];
    $day = date('d', $date);
    $month = $months[date('n', $date) - 1];
    $year = date('Y', $date);
    return array('week_day' => $day_week, 'date' => "$day  $month");
}

function format_time($time, $period) {
    list($hour, $minute) = explode(':', $time);
    $hour = ('PM' && (int) $hour < 12) ? $hour + 12 : $hour;
    $minute = (int) $minute;
    
    if ($minute == 0) {
        $time = "$hour" . 'h';
    } else {
        
        $time = "$hour" . 'h' . ($minute < 10 ? '0' : '') . "$minute" ;
    }
    return $time;
}

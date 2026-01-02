<?php
function calendar($atts) {  
    $atts = shortcode_atts(  
        array(  
            'id' => '',
            'title' => ''
        ),  
        $atts,  
        'calendar'
    );  
    $shortcode_id = $atts['id'];  
    $eventsData = MEC_main::get_shortcode_events($shortcode_id);

    ob_start();
    echo '<h2 class="wp-block-heading has-text-align-center">' . $atts['title'] . '</h2>';
    $ingressoText = ($atts['title'] === 'Shows') ? 'Ingressos' : '';
    // echo '<pre>';
    // var_dump($eventsData);
    // echo '</pre>';

    if (!empty($eventsData) && is_array($eventsData)) :
        echo '<div class="event__grid"><div class="wp-block-group__inner-container">';
        foreach ($eventsData as $date => $events) :  
            foreach ($events as $event) :
                $event_id = $event->ID;
                $event_title = $event->data->title;  
                $event_tickets = $event->data->meta['mec_tickets'];
                $event_date = $event->data->meta['mec_date']['start']['date'];  
                $event_hour = $event->data->meta['mec_date']['start']['hour'] . ':' . $event->data->meta['mec_date']['start']['minutes'];  
                $event_ampm = $event->data->meta['mec_date']['start']['ampm'];  
                $event_thumbnail = $event->data->thumbnails['medium'];
                $post = get_post($event->data->post->ID);
                $event_excerpt = $post->post_excerpt;
  
                $prices = array_map(fn($item) => (float) $item['price'], $event_tickets);
                $minPrice = min($prices);
                $maxPrice = max($prices);
                ?>  
                
                <div class="event__item">
                <div class="event__thumbnail">
                    <figure>
                        <?php echo $event_thumbnail ?>
                    </figure>
                </div>

                <div class="event__content">
                <div class="event__wrapper">
                    <span>
                        <h3 class="event__title">
                            <?php 
                            echo esc_html($event_title);
                            ?>
                        </h3>
                        <p>
                            <span class="event__time">
                                <time datetime="<?php echo esc_attr($event_date); ?>">
                                    <?php 
                                    $event_start = ptBR_date($event_date);
                                    echo $event_start['week_day']  . ', ';
                                    echo $event_start['date'] . ' '. format_time($event_hour, $event_ampm);
                                    ?>
                                </time>
                            </span>
                        </p>
                    </span>
                    <div class="event__description">
                        <?php
                        echo nl2br($event_excerpt); 
                        ?>
                    </div>
                    <?php
                   
                   $ticket = $event_tickets[1];
                 // print_r($ticket);
                   // foreach ($event_tickets as $ticket) :
                        //if (strlen($ticket['description']) > 0) :
                        ?>
                        
                        <!-- <div class="event__description"><?php echo limit_words($ticket['description'], 30); ?></div> -->
                        
                        <?php //endif; ?>
                        
                        <div class="event__info">
                            <span class="event__time">
                                <?php 
                                if ($minPrice !== $maxPrice) :
                                    echo $ingressoText ;
                                endif;
                                ?>
                            </span>

                            <span class="event__price">
                                
                                <?php
                                if (strlen($ticket['price_label']) > 0) {
                                    echo '<span class="event__price-label"><span>' . number_format_brl( (float)$ticket['price_label'] ) . '</span></span>';
                                    echo '' . number_format_brl($maxPrice);
                                } else {
                                    echo '<span class="event__price-label"><span></span></span>';
                                    if ($minPrice !== $maxPrice) :
                                      echo ' de ' . number_format_brl($minPrice) . ' a ' .  number_format_brl($maxPrice);
                                    else :
                                       echo number_format_brl( (float)$ticket['price'] );
                                    endif;
                                }
                                ?>
                            </span>
                        </div>
                        
                        <?php 
                        
                    //endforeach;
                    ?>
                    </div>
                </div>
                <div class="event__action-container">
                    <div class="event__action">
                        <a href="<?php echo $event->data->post->guid; ?>" class="event__btn event__btn--more">Veja mais</a>
                        <a class="event__btn event__btn--buy" data-js="buy-ticket" data-id="<?php echo $event_id; ?>">
                            <span class="loading"><img src="<?php echo get_stylesheet_directory_uri() . '/dist/images/bmp/loading.gif' ?>"></span>
                            <span class="label">Comprar</span>
                        </a>
                    </div>
                </div>
            </div>

                <?php  
            endforeach;  
        endforeach;
        echo '</div></div>';
    else :  
        echo '<p style="text-align: center; color: white;">Ops! No momento não há ' . strtolower($atts['title']) . ' cadastradas. :(</p>';  
    endif;
    echo '</div>';
    wp_reset_postdata();  
    return ob_get_clean();  
}
add_shortcode('calendar', 'calendar');
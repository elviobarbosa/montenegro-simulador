<?php
get_header();

if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
    <div class="single-blog">
        
        <div class="single-blog__container">

            <div class="single-blog__sidebar">
                <div class="single-blog__wrapper">
                    <p><strong>Artigos</strong></p>
                    <ul>
                        <?php
                        $content = get_the_content();
                        $content = apply_filters('the_content', $content);
                        
                        $post_title = get_the_title();
                        $post_title_id = sanitize_title($post_title);
                        echo '<li><a href="#' . $post_title_id . '" class="active">' . $post_title . '</a></li>';
                        
                        preg_match_all('/<h2[^>]*>(.*?)<\/h2>/i', $content, $matches);
                        
                        if (!empty($matches[1])) {
                            foreach ($matches[1] as $heading) {
                                $clean_heading = strip_tags($heading);
                                $heading_id = sanitize_title($clean_heading);
                                echo '<li><a href="#' . $heading_id . '">' . $clean_heading . '</a></li>';
                            }
                        }
                        ?>
                    </ul>
                </div>
            </div>
                
            <div class="single-blog__content">
                <h1 class="single-blog__title" id="<?php echo sanitize_title(get_the_title()); ?>"><?php the_title() ?></h1>
                <?php
                $content = get_the_content();
                $content = apply_filters('the_content', $content);
                
                $content = preg_replace_callback('/<h2([^>]*)>(.*?)<\/h2>/i', function($matches) {
                    $attributes = $matches[1];
                    $heading_text = strip_tags($matches[2]);
                    $heading_id = sanitize_title($heading_text);
                    
                    if (strpos($attributes, 'id=') === false) {
                        $attributes .= ' id="' . $heading_id . '"';
                    }
                    
                    return '<h2' . $attributes . '>' . $matches[2] . '</h2>';
                }, $content);
                
                echo $content;
                ?>
            </div>
        </div>

        
    </div>
    <div class="single-blog__related-posts">
        <div class="single-blog__related-posts-wrapper">
            <h3 class="single-blog__related-posts-title">Artigos em destaque</h3>
            <?php
            echo render_block([
                'blockName' => 'custom/ultimos-posts',
                'attrs' => [],
                'innerContent' => [],
                'innerHTML' => '',
                'innerBlocks' => []
            ]);
            ?>
        </div>
    </div>
    
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const sidebarLinks = document.querySelectorAll('.single-blog__sidebar a');
        const headings = document.querySelectorAll('h1, h2');
        
        function removeActiveClass() {
            sidebarLinks.forEach(link => link.classList.remove('active'));
        }
        
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                removeActiveClass();
                this.classList.add('active');
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        window.addEventListener('scroll', function() {
            let current = '';
            headings.forEach(heading => {
                const rect = heading.getBoundingClientRect();
                if (rect.top <= 100) {
                    current = heading.id;
                }
            });
            
            if (current) {
                removeActiveClass();
                const activeLink = document.querySelector('.single-blog__sidebar a[href="#' + current + '"]');
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
    </script>
    
    <?php endwhile; endif;
    get_footer();
?>
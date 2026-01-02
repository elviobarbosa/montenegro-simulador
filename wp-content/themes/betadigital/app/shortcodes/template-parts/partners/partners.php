<?php
$content = $args['title'];
$images = $args['images'];
$active = 'active';
$style = 'style="display: block;"';
?>

<div class="partners">
    <?php
    for ($i = 0; $i < count($content); $i+=1) : ?>
        <div>
            <div>
                <div>
                    <img src="<?php echo $images[$i]?>">
                </div>
                
            </div>
        </div> 
        <?php
    endfor
    ?>
</div>
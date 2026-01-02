<?php
    register_block_pattern_category(
        'beta-digital',
        array( 'label' => __( 'Beta Digital', 'wpdocs-my-plugin' ) )
    );

    // function columnGroup( $evenColumn, $oddColumn ) {
    //     return '<!-- wp:columns {"className":"c-experiences__container"} -->
    //     <div class="wp-block-columns c-experiences__container"><!-- wp:column -->
    //     <div class="wp-block-column">'.$evenColumn.'</div>
    //     <!-- /wp:column -->
        
    //     <!-- wp:column -->
    //     <div class="wp-block-column">'.$oddColumn.'</div>
    //     <!-- /wp:column --></div>
    //     <!-- /wp:columns -->';
    // }

    function template() {
        $content = '<!-- wp:group {"className":"cv-lattes","layout":{"type":"constrained"}} -->
        <div class="wp-block-group cv-lattes"><!-- wp:heading {"className":"cv-lattes__title"} -->
        <h2 class="cv-lattes__title">Currículo Lattes</h2>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"className":"cv-lattes__description"} -->
        <p class="cv-lattes__description">Médico Neurocirurgião, professor e pesquisador. Graduação em Medicina pela Universidade de São Paulo (USP) - Campus de Ribeirão Preto. Residência médica em Neurocirurgia no Hospital das Clínicas da Faculdade de Medicina de Ribeirão Preto da USP. Especialização em Neurocirurgia na Universidade Paris V (Descartes - França). Clinical Fellowship no Hospital Necker (Paris - França). Doutorado pela Universidade de São Paulo (USP). Tem Título de Especialista em Neurocirurgia pela Sociedade Brasileira de Neurocirurgia - SBN. Possui trabalhos científicos publicados em revistas médicas, sendo a maioria em periódicos internacionais. Possui 6 capítulos de livros publicados e foi tradutor da obra : Cranial Anatomy and Surgical Approaches, de Albert L. Rhoton, para o português. É membro titular da Sociedade Brasileira de Neurocirurgia e da Academia Brasileira de Neurocirurgia, membro estrangeiro da Sociedade Européia de Neurocirurgia Pediátrica e membro ativo da Sociedade Internacional de Neurocirurgia Pediátrica. Foi neurocirurgião no Hospital das Clínicas da Faculdade de Medicina de Ribeirão Preto da Universidade de São Paulo (USP) de 2007 a 2011, onde orientou atividades de médicos residentes. É neurocirugião no Hospital Infantil Albert Sabin, em Fortaleza-CE, onde exerce atividade docente. É orientador do Programa de Mestrado Profissional em Tecnologia Minimamente Invasiva e Simulação na Área da Saúde, do Centro Universitário Christus. É professor do curso de Medicina da Universidade de Fortaleza (UNIFOR), onde exerce atualmente a função de Coordenador.</p>
        <!-- /wp:paragraph -->
        <!-- wp:buttons -->
        <div class="wp-block-buttons"><!-- wp:button {"align":"center","fontSize":"small"} -->
        <div class="wp-block-button aligncenter has-custom-font-size has-small-font-size"><a class="wp-block-button__link wp-element-button">Veja o currículo completo</a></div>
        <!-- /wp:button --></div>
        <!-- /wp:buttons --></div>
        <!-- /wp:group -->';
        return $content;
    }

    function pattern_cv_lattes() {
       
       

        register_block_pattern(
            'beta-digital/pattern-cv-lattes',
            array(
                'title'       => __( 'Experiências', 'pattern-cv-lattes' ),
                'categories'    => ['beta-digital'],
                'description' => _x( 'Bloco padrão para experiências', 'Block pattern experience', 'pattern-cv-lattes' ),
                'content'     => "<!-- wp:group {\"className\":\"cv-lattes\",\"layout\":{\"type\":\"constrained\"}} -->\n        <div class=\"wp-block-group cv-lattes\"><!-- wp:heading {\"className\":\"cv-lattes__title\"} -->\n        <h2 class=\"cv-lattes__title\">Currículo Lattes</h2>\n        <!-- /wp:heading -->\n        <!-- wp:paragraph {\"className\":\"cv-lattes__description\"} -->\n        <p class=\"cv-lattes__description\">Médico Neurocirurgião, professor e pesquisador. Graduação em Medicina pela Universidade de São Paulo (USP) - Campus de Ribeirão Preto. Residência médica em Neurocirurgia no Hospital das Clínicas da Faculdade de Medicina de Ribeirão Preto da USP. Especialização em Neurocirurgia na Universidade Paris V (Descartes - França). Clinical Fellowship no Hospital Necker (Paris - França). Doutorado pela Universidade de São Paulo (USP). Tem Título de Especialista em Neurocirurgia pela Sociedade Brasileira de Neurocirurgia - SBN. Possui trabalhos científicos publicados em revistas médicas, sendo a maioria em periódicos internacionais. Possui 6 capítulos de livros publicados e foi tradutor da obra : Cranial Anatomy and Surgical Approaches, de Albert L. Rhoton, para o português. É membro titular da Sociedade Brasileira de Neurocirurgia e da Academia Brasileira de Neurocirurgia, membro estrangeiro da Sociedade Européia de Neurocirurgia Pediátrica e membro ativo da Sociedade Internacional de Neurocirurgia Pediátrica. Foi neurocirurgião no Hospital das Clínicas da Faculdade de Medicina de Ribeirão Preto da Universidade de São Paulo (USP) de 2007 a 2011, onde orientou atividades de médicos residentes. É neurocirugião no Hospital Infantil Albert Sabin, em Fortaleza-CE, onde exerce atividade docente. É orientador do Programa de Mestrado Profissional em Tecnologia Minimamente Invasiva e Simulação na Área da Saúde, do Centro Universitário Christus. É professor do curso de Medicina da Universidade de Fortaleza (UNIFOR), onde exerce atualmente a função de Coordenador.</p>\n        <!-- /wp:paragraph -->\n        <!-- wp:buttons -->\n        <div class=\"wp-block-buttons\"><!-- wp:button {\"align\":\"center\",\"fontSize\":\"small\"} -->\n        <div class=\"wp-block-button aligncenter has-custom-font-size has-small-font-size\"><a class=\"wp-block-button__link wp-element-button\">Veja o currículo completo</a></div>\n        <!-- /wp:button --></div>\n        <!-- /wp:buttons --></div>\n        <!-- /wp:group -->",
            )
        );
    }
    add_action( 'init', 'pattern_cv_lattes' );

?>
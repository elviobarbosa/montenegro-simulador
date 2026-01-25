<?php
/**
 * SVG Importer - Parse e extrai shapes de arquivos SVG
 *
 * Responsável por:
 * - Parse de arquivos SVG usando DOMDocument
 * - Extração de elementos <path>, <polygon>, <polyline> e <rect>
 * - Conversão de path commands para coordenadas
 * - Normalização de coordenadas baseada no viewBox
 */
class SVGImporter {

    /**
     * ViewBox do SVG
     */
    private $viewBox = [
        'x' => 0,
        'y' => 0,
        'width' => 100,
        'height' => 100
    ];

    /**
     * Parse do conteúdo SVG e extrai todos os shapes
     *
     * @param string $svg_content Conteúdo do arquivo SVG
     * @return array Array com shapes extraídos e metadados
     */
    public function parse($svg_content) {
        $result = [
            'success' => false,
            'shapes' => [],
            'viewBox' => null,
            'dimensions' => null,
            'error' => null
        ];

        try {
            // Limpa o conteúdo SVG
            $svg_content = $this->sanitizeSVG($svg_content);

            // Verifica se o conteúdo está vazio
            if (empty($svg_content)) {
                throw new Exception('Conteúdo SVG vazio após sanitização');
            }

            // Cria DOMDocument
            $doc = new DOMDocument();
            $doc->preserveWhiteSpace = false;
            libxml_use_internal_errors(true);

            if (!$doc->loadXML($svg_content)) {
                $errors = libxml_get_errors();
                $error_msg = 'Erro ao fazer parse do SVG';
                if (!empty($errors)) {
                    $first_error = $errors[0];
                    $error_msg .= ': ' . trim($first_error->message) . ' (linha ' . $first_error->line . ')';
                }
                libxml_clear_errors();
                throw new Exception($error_msg);
            }

            libxml_clear_errors();

            // Extrai viewBox e dimensões
            $svg_element = $doc->getElementsByTagName('svg')->item(0);
            if (!$svg_element) {
                throw new Exception('Elemento SVG não encontrado');
            }

            $this->extractViewBox($svg_element);
            $result['viewBox'] = $this->viewBox;
            $result['dimensions'] = [
                'width' => $svg_element->getAttribute('width') ?: $this->viewBox['width'],
                'height' => $svg_element->getAttribute('height') ?: $this->viewBox['height']
            ];

            // Extrai shapes
            $shapes = [];

            // Extrai paths
            $paths = $this->extractPaths($doc);
            $shapes = array_merge($shapes, $paths);

            // Extrai polygons
            $polygons = $this->extractPolygons($doc);
            $shapes = array_merge($shapes, $polygons);

            // Extrai polylines
            $polylines = $this->extractPolylines($doc);
            $shapes = array_merge($shapes, $polylines);

            // Extrai rects
            $rects = $this->extractRects($doc);
            $shapes = array_merge($shapes, $rects);

            $result['shapes'] = $shapes;
            $result['success'] = true;
            $result['total_shapes'] = count($shapes);

        } catch (Exception $e) {
            $result['error'] = $e->getMessage();
        }

        return $result;
    }

    /**
     * Sanitiza o conteúdo SVG removendo elementos potencialmente perigosos
     */
    private function sanitizeSVG($content) {
        // Remove declaração XML (pode causar problemas no parse)
        $content = preg_replace('/<\?xml[^?]*\?>/i', '', $content);

        // Remove BOM se existir
        $content = preg_replace('/^\xEF\xBB\xBF/', '', $content);

        // Remove doctype
        $content = preg_replace('/<!DOCTYPE[^>]*>/i', '', $content);

        // Remove scripts
        $content = preg_replace('/<script[^>]*>.*?<\/script>/is', '', $content);

        // Remove event handlers
        $content = preg_replace('/\s+on\w+\s*=\s*["\'][^"\']*["\']/i', '', $content);

        // Remove tags perigosas
        $content = preg_replace('/<(foreignObject|use|image)[^>]*>.*?<\/\1>/is', '', $content);

        // Trim whitespace
        $content = trim($content);

        return $content;
    }

    /**
     * Extrai viewBox do elemento SVG
     */
    private function extractViewBox($svg_element) {
        $viewBox = $svg_element->getAttribute('viewBox');

        if ($viewBox) {
            $parts = preg_split('/[\s,]+/', trim($viewBox));
            if (count($parts) >= 4) {
                $this->viewBox = [
                    'x' => floatval($parts[0]),
                    'y' => floatval($parts[1]),
                    'width' => floatval($parts[2]),
                    'height' => floatval($parts[3])
                ];
            }
        } else {
            // Usa width/height como fallback
            $width = $svg_element->getAttribute('width');
            $height = $svg_element->getAttribute('height');

            if ($width && $height) {
                $this->viewBox['width'] = floatval(preg_replace('/[^0-9.]/', '', $width));
                $this->viewBox['height'] = floatval(preg_replace('/[^0-9.]/', '', $height));
            }
        }
    }

    /**
     * Extrai elementos <path>
     */
    private function extractPaths($doc) {
        $shapes = [];
        $paths = $doc->getElementsByTagName('path');

        foreach ($paths as $index => $path) {
            $d = $path->getAttribute('d');
            if (empty($d)) continue;

            $points = $this->pathToPoints($d);
            if (count($points) < 3) continue; // Precisa de pelo menos 3 pontos

            $shapes[] = [
                'id' => $path->getAttribute('id') ?: 'path_' . ($index + 1),
                'type' => 'path',
                'points' => $points,
                'fill' => $this->getColor($path, 'fill'),
                'stroke' => $this->getColor($path, 'stroke'),
                'original_d' => $d
            ];
        }

        return $shapes;
    }

    /**
     * Extrai elementos <polygon>
     */
    private function extractPolygons($doc) {
        $shapes = [];
        $polygons = $doc->getElementsByTagName('polygon');

        foreach ($polygons as $index => $polygon) {
            $pointsAttr = $polygon->getAttribute('points');
            if (empty($pointsAttr)) continue;

            $points = $this->pointsAttributeToArray($pointsAttr);
            if (count($points) < 3) continue;

            $shapes[] = [
                'id' => $polygon->getAttribute('id') ?: 'polygon_' . ($index + 1),
                'type' => 'polygon',
                'points' => $points,
                'fill' => $this->getColor($polygon, 'fill'),
                'stroke' => $this->getColor($polygon, 'stroke')
            ];
        }

        return $shapes;
    }

    /**
     * Extrai elementos <polyline>
     */
    private function extractPolylines($doc) {
        $shapes = [];
        $polylines = $doc->getElementsByTagName('polyline');

        foreach ($polylines as $index => $polyline) {
            $pointsAttr = $polyline->getAttribute('points');
            if (empty($pointsAttr)) continue;

            $points = $this->pointsAttributeToArray($pointsAttr);
            if (count($points) < 3) continue;

            // Fecha o polyline se não estiver fechado
            $first = $points[0];
            $last = $points[count($points) - 1];
            if ($first['x'] != $last['x'] || $first['y'] != $last['y']) {
                $points[] = $first;
            }

            $shapes[] = [
                'id' => $polyline->getAttribute('id') ?: 'polyline_' . ($index + 1),
                'type' => 'polyline',
                'points' => $points,
                'fill' => $this->getColor($polyline, 'fill'),
                'stroke' => $this->getColor($polyline, 'stroke')
            ];
        }

        return $shapes;
    }

    /**
     * Extrai elementos <rect>
     */
    private function extractRects($doc) {
        $shapes = [];
        $rects = $doc->getElementsByTagName('rect');

        foreach ($rects as $index => $rect) {
            $x = floatval($rect->getAttribute('x') ?: 0);
            $y = floatval($rect->getAttribute('y') ?: 0);
            $width = floatval($rect->getAttribute('width'));
            $height = floatval($rect->getAttribute('height'));

            if ($width <= 0 || $height <= 0) continue;

            // Converte rect para 4 pontos
            $points = [
                ['x' => $x, 'y' => $y],
                ['x' => $x + $width, 'y' => $y],
                ['x' => $x + $width, 'y' => $y + $height],
                ['x' => $x, 'y' => $y + $height]
            ];

            // Aplica transformação se existir
            $transform = $rect->getAttribute('transform');
            if ($transform) {
                $points = $this->applyTransform($points, $transform);
            }

            $shapes[] = [
                'id' => $rect->getAttribute('id') ?: 'rect_' . ($index + 1),
                'type' => 'rect',
                'points' => $points,
                'fill' => $this->getColor($rect, 'fill'),
                'stroke' => $this->getColor($rect, 'stroke')
            ];
        }

        return $shapes;
    }

    /**
     * Aplica transformação SVG aos pontos
     * Suporta: translate, rotate, scale, matrix
     *
     * No SVG, transform="translate(tx,ty) rotate(a)" significa:
     * - O sistema de coordenadas é primeiro transladado, depois rotacionado
     * - Para aplicar aos pontos, fazemos na ordem INVERSA (direita para esquerda)
     * - Primeiro rotate nos pontos originais, depois translate
     */
    private function applyTransform($points, $transformStr) {
        // Parse das transformações
        $transforms = [];
        preg_match_all('/(translate|rotate|scale|matrix)\s*\(([^)]+)\)/i', $transformStr, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $type = strtolower($match[1]);
            $values = array_map('floatval', preg_split('/[\s,]+/', trim($match[2])));
            $transforms[] = ['type' => $type, 'values' => $values];
        }

        // IMPORTANTE: Aplica na ordem INVERSA (da direita para esquerda)
        // transform="translate(x,y) rotate(a)" -> primeiro rotate, depois translate
        $transforms = array_reverse($transforms);

        foreach ($transforms as $transform) {
            $points = $this->applyOneTransform($points, $transform['type'], $transform['values']);
        }

        return $points;
    }

    /**
     * Aplica uma única transformação
     */
    private function applyOneTransform($points, $type, $values) {
        $result = [];

        switch ($type) {
            case 'translate':
                $tx = $values[0] ?? 0;
                $ty = $values[1] ?? 0;
                foreach ($points as $p) {
                    $result[] = [
                        'x' => $p['x'] + $tx,
                        'y' => $p['y'] + $ty
                    ];
                }
                break;

            case 'rotate':
                $angle = deg2rad($values[0] ?? 0);
                // Se rotate tem 3 valores: rotate(angle, cx, cy)
                // Se rotate tem 1 valor: rotate(angle) - rotaciona em torno de (0,0)
                $cx = isset($values[1]) ? $values[1] : 0;
                $cy = isset($values[2]) ? $values[2] : 0;
                $cos = cos($angle);
                $sin = sin($angle);

                foreach ($points as $p) {
                    // Translada para origem do centro de rotação, rotaciona, translada de volta
                    $dx = $p['x'] - $cx;
                    $dy = $p['y'] - $cy;
                    $result[] = [
                        'x' => $cx + ($dx * $cos - $dy * $sin),
                        'y' => $cy + ($dx * $sin + $dy * $cos)
                    ];
                }
                break;

            case 'scale':
                $sx = $values[0] ?? 1;
                $sy = $values[1] ?? $sx;
                foreach ($points as $p) {
                    $result[] = [
                        'x' => $p['x'] * $sx,
                        'y' => $p['y'] * $sy
                    ];
                }
                break;

            case 'matrix':
                // matrix(a, b, c, d, e, f)
                $a = $values[0] ?? 1;
                $b = $values[1] ?? 0;
                $c = $values[2] ?? 0;
                $d = $values[3] ?? 1;
                $e = $values[4] ?? 0;
                $f = $values[5] ?? 0;

                foreach ($points as $p) {
                    $result[] = [
                        'x' => $a * $p['x'] + $c * $p['y'] + $e,
                        'y' => $b * $p['x'] + $d * $p['y'] + $f
                    ];
                }
                break;

            default:
                $result = $points;
        }

        return $result;
    }

    /**
     * Converte atributo points para array de coordenadas
     * Ex: "100,200 150,200 150,250" => [{x:100, y:200}, {x:150, y:200}, ...]
     */
    private function pointsAttributeToArray($pointsAttr) {
        $points = [];

        // Divide por espaços ou vírgulas
        $pairs = preg_split('/[\s]+/', trim($pointsAttr));

        foreach ($pairs as $pair) {
            $coords = preg_split('/[,]/', $pair);
            if (count($coords) >= 2) {
                $points[] = [
                    'x' => floatval($coords[0]),
                    'y' => floatval($coords[1])
                ];
            }
        }

        return $points;
    }

    /**
     * Converte path d attribute para array de pontos
     * Suporta comandos: M, L, H, V, Z (e versões minúsculas relativas)
     * Curvas Bézier são linearizadas
     */
    private function pathToPoints($d) {
        $points = [];
        $currentX = 0;
        $currentY = 0;
        $startX = 0;
        $startY = 0;

        // Normaliza o path - adiciona espaços após comandos
        $d = preg_replace('/([MLHVCSQTAZmlhvcsqtaz])/', ' $1 ', $d);
        $d = preg_replace('/,/', ' ', $d);
        $d = preg_replace('/\s+/', ' ', trim($d));

        // Tokeniza
        $tokens = explode(' ', $d);
        $tokens = array_filter($tokens, function($t) { return $t !== ''; });
        $tokens = array_values($tokens);

        $i = 0;
        $currentCommand = '';

        while ($i < count($tokens)) {
            $token = $tokens[$i];

            // Verifica se é um comando
            if (preg_match('/^[MLHVCSQTAZmlhvcsqtaz]$/', $token)) {
                $currentCommand = $token;
                $i++;
                continue;
            }

            // Processa baseado no comando atual
            switch ($currentCommand) {
                case 'M': // Move to (absoluto)
                    $currentX = floatval($token);
                    $currentY = floatval($tokens[$i + 1] ?? 0);
                    $startX = $currentX;
                    $startY = $currentY;
                    $points[] = ['x' => $currentX, 'y' => $currentY];
                    $i += 2;
                    $currentCommand = 'L'; // Após M, próximos pares são L
                    break;

                case 'm': // Move to (relativo)
                    $currentX += floatval($token);
                    $currentY += floatval($tokens[$i + 1] ?? 0);
                    $startX = $currentX;
                    $startY = $currentY;
                    $points[] = ['x' => $currentX, 'y' => $currentY];
                    $i += 2;
                    $currentCommand = 'l';
                    break;

                case 'L': // Line to (absoluto)
                    $currentX = floatval($token);
                    $currentY = floatval($tokens[$i + 1] ?? 0);
                    $points[] = ['x' => $currentX, 'y' => $currentY];
                    $i += 2;
                    break;

                case 'l': // Line to (relativo)
                    $currentX += floatval($token);
                    $currentY += floatval($tokens[$i + 1] ?? 0);
                    $points[] = ['x' => $currentX, 'y' => $currentY];
                    $i += 2;
                    break;

                case 'H': // Horizontal line (absoluto)
                    $currentX = floatval($token);
                    $points[] = ['x' => $currentX, 'y' => $currentY];
                    $i++;
                    break;

                case 'h': // Horizontal line (relativo)
                    $currentX += floatval($token);
                    $points[] = ['x' => $currentX, 'y' => $currentY];
                    $i++;
                    break;

                case 'V': // Vertical line (absoluto)
                    $currentY = floatval($token);
                    $points[] = ['x' => $currentX, 'y' => $currentY];
                    $i++;
                    break;

                case 'v': // Vertical line (relativo)
                    $currentY += floatval($token);
                    $points[] = ['x' => $currentX, 'y' => $currentY];
                    $i++;
                    break;

                case 'C': // Curva Bézier cúbica (absoluto) - lineariza
                case 'c':
                    // Pega os 6 valores: x1,y1 x2,y2 x,y
                    $x1 = floatval($token);
                    $y1 = floatval($tokens[$i + 1] ?? 0);
                    $x2 = floatval($tokens[$i + 2] ?? 0);
                    $y2 = floatval($tokens[$i + 3] ?? 0);
                    $x = floatval($tokens[$i + 4] ?? 0);
                    $y = floatval($tokens[$i + 5] ?? 0);

                    if ($currentCommand === 'c') {
                        $x1 += $currentX; $y1 += $currentY;
                        $x2 += $currentX; $y2 += $currentY;
                        $x += $currentX; $y += $currentY;
                    }

                    // Lineariza a curva com pontos intermediários
                    $bezierPoints = $this->linearizeCubicBezier(
                        $currentX, $currentY, $x1, $y1, $x2, $y2, $x, $y, 5
                    );
                    foreach ($bezierPoints as $bp) {
                        $points[] = $bp;
                    }

                    $currentX = $x;
                    $currentY = $y;
                    $i += 6;
                    break;

                case 'Q': // Curva Bézier quadrática (absoluto)
                case 'q':
                    $x1 = floatval($token);
                    $y1 = floatval($tokens[$i + 1] ?? 0);
                    $x = floatval($tokens[$i + 2] ?? 0);
                    $y = floatval($tokens[$i + 3] ?? 0);

                    if ($currentCommand === 'q') {
                        $x1 += $currentX; $y1 += $currentY;
                        $x += $currentX; $y += $currentY;
                    }

                    $bezierPoints = $this->linearizeQuadraticBezier(
                        $currentX, $currentY, $x1, $y1, $x, $y, 5
                    );
                    foreach ($bezierPoints as $bp) {
                        $points[] = $bp;
                    }

                    $currentX = $x;
                    $currentY = $y;
                    $i += 4;
                    break;

                case 'Z': // Close path
                case 'z':
                    if ($currentX != $startX || $currentY != $startY) {
                        $points[] = ['x' => $startX, 'y' => $startY];
                    }
                    $currentX = $startX;
                    $currentY = $startY;
                    $i++;
                    break;

                default:
                    $i++;
                    break;
            }
        }

        return $points;
    }

    /**
     * Lineariza curva Bézier cúbica
     */
    private function linearizeCubicBezier($x0, $y0, $x1, $y1, $x2, $y2, $x3, $y3, $segments = 5) {
        $points = [];

        for ($i = 1; $i <= $segments; $i++) {
            $t = $i / $segments;
            $t2 = $t * $t;
            $t3 = $t2 * $t;
            $mt = 1 - $t;
            $mt2 = $mt * $mt;
            $mt3 = $mt2 * $mt;

            $x = $mt3 * $x0 + 3 * $mt2 * $t * $x1 + 3 * $mt * $t2 * $x2 + $t3 * $x3;
            $y = $mt3 * $y0 + 3 * $mt2 * $t * $y1 + 3 * $mt * $t2 * $y2 + $t3 * $y3;

            $points[] = ['x' => $x, 'y' => $y];
        }

        return $points;
    }

    /**
     * Lineariza curva Bézier quadrática
     */
    private function linearizeQuadraticBezier($x0, $y0, $x1, $y1, $x2, $y2, $segments = 5) {
        $points = [];

        for ($i = 1; $i <= $segments; $i++) {
            $t = $i / $segments;
            $mt = 1 - $t;

            $x = $mt * $mt * $x0 + 2 * $mt * $t * $x1 + $t * $t * $x2;
            $y = $mt * $mt * $y0 + 2 * $mt * $t * $y1 + $t * $t * $y2;

            $points[] = ['x' => $x, 'y' => $y];
        }

        return $points;
    }

    /**
     * Obtém cor de um atributo (fill ou stroke)
     */
    private function getColor($element, $attr) {
        $color = $element->getAttribute($attr);

        // Se não tem o atributo, verifica no style
        if (empty($color) || $color === 'none') {
            $style = $element->getAttribute('style');
            if ($style && preg_match('/' . $attr . '\s*:\s*([^;]+)/i', $style, $matches)) {
                $color = trim($matches[1]);
            }
        }

        if (empty($color) || $color === 'none') {
            return null;
        }

        return $color;
    }
}

<?php
    ob_start();
    require_once "app/plugin/plugin.Device.php";
    $Device     =   new mobil_replace;

    if ( $Device->isMobile() )
        require_once "public/mobile/index.html";
    else
        require_once "public/desktop/index.html";

    $html   =   ob_get_clean();
    echo preg_replace(array('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '/\r\n|\r|\n|\t|\s\s+/', '/<!--(.*)-->/Uis'), '', $html);

    ob_end_flush();
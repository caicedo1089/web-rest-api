<?php

require 'vendor/autoload.php';

require 'config/general.php';

require 'app/Autoloader.php';

App\Autoloader::register('\\App\\Core\\PCController');
App\Autoloader::register('\\App\\Core\\PCModel');

$router = new Router\Router();

//El API
$router->add(
    '/api/([a-zA-Z]+)/([0-9a-zA-Z]*)', 
    function ($nameController, $id) 
    {
        try
        {
            $nameController = ucwords(strtolower($nameController));

            require_once "app/api/Controllers/{$nameController}.php";
            $strController = "\\App\\Api\\Controllers\\{$nameController}";
            $insController = new $strController('EUser');
            
            $insController->processRequest($id);
        }
        catch(Exception $e)
        {
            $error = $e->getMessage();
            header('Content-Type: application/json');
            header($_SERVER["SERVER_PROTOCOL"] . " 500 " . $error);
            echo json_encode(['error' => $error]);
        }
    }
);

//La WEB
$router->add(
    '/web', 
    function () 
    {
        include_once 'app/web/index.php';
    }
);

$router->add('/.*', function () {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found");
    echo '<h1>PC - 404 - El sitio solicitado no existe</h1>';
});

$router->route();
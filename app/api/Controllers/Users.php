<?php 

namespace App\Api\Controllers;

use App\Core\PCController;

//use App\Api\Models\User;

class Users extends PCController
{
    public function __construct($strModel, $strID = null)
    {
        parent::__construct();

        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

        //Cargamos el modelo
        require_once "app/api/Models/{$strModel}.php";
        $this->strModel = "\\App\\Api\\Models\\{$strModel}";

        $this->strID = $strID;
        if(empty($strID))
        {
            $this->strID = (new $this->strModel)->getKeyName();
        }
    }

    function processRequest($id)
    {
        session_start();
        
        if(empty($_SESSION['user']))
        {
            throw new \Exception('Debe autenticarse para acceder al servicio.');
        }

        parent::processRequest($id);
    }

    function index($id)
    {
        $data = [];
        
        if($id)
        {
            $model = call_user_func("{$this->strModel}::find", $id);

            if($model)
            {
                $data = $model->toArray();
            }
        }
        else
        {
            $query = call_user_func("{$this->strModel}::query");
            
            if(!empty($_GET['filter']))
            {
                $strFilter = $_GET['filter'];

                $data = $query->where(function($q) use ($strFilter){
                    $q->where('email', 'like', '%' . $strFilter . '%')
                    ->orWhere('full_name', 'like', '%' . $strFilter . '%');
                })
                ->get();
            }
            else
            {
                $data = $query->get();
            }
        }

        return $this->_respJSON($data);
    }
}
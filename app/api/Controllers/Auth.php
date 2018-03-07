<?php 

namespace App\Api\Controllers;

use App\Core\PCController;

use Illuminate\Database\Capsule\Manager as DB;

class Auth extends PCController
{
    public function __construct($strModel, $strID = null)
    {
        parent::__construct();

        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, POST");

        //Cargamos el modelo
        require_once "app/api/Models/{$strModel}.php";
        $this->strModel = "\\App\\Api\\Models\\{$strModel}";

        $this->strID = $strID;
        if(empty($strID))
        {
            $this->strID = (new $this->strModel)->getKeyName();
        }
    }

    public function processRequest($strMethod)
    {
        switch ($_SERVER["REQUEST_METHOD"]) 
        {
            case 'GET':
                switch ($strMethod) 
                {
                    case 'logout':
                        $this->{$strMethod}();
                        break;
                    
                    default:
                        throw new \Exception('Método no permitido');
                        break;
                }
                break;
            case 'POST':
                switch ($strMethod) 
                {
                    case 'login':
                    case 'register':
                        $this->{$strMethod}();
                        break;
                    
                    default:
                        throw new \Exception('Método no permitido');
                        break;
                }
                break;
            
            default:
                throw new \Exception('Verbo HTTP no soportado');
                break;
        }
    }

    protected function login()
    {
        $error = 'Llamado erroneo, verifique el end point.';
        $data = null;

        $arrData = $this->_getJSONBody(true);
        
        if(!empty($arrData['login']) && !empty($arrData['password']))
        {
            //DB::enableQueryLog();

            $query = call_user_func("{$this->strModel}::query");
            $insModel = $query->where(function($q) use ($arrData){
                $q->where('email', '=', $arrData['login'])
                ->orWhere('username', '=', $arrData['login']);
            })
            ->where('password', md5($arrData['password']))
            ->first();

            //var_dump(DB::getQueryLog());

            if(!empty($insModel))
            {
                session_start();
                $data = $insModel->toArray();
                $_SESSION['user'] = $data;
            }
            else
            {
                $error = 'Usuarios o contraseña erronea';
            }
        }
        else
        {
            $error = 'Debe enviar el login y el password';
        }

        return $this->_respJSON($data, null, $error);
    }

    protected function logout()
    {
        $error = 'No hay sessión abierta';
        $data = null;

        session_start();

        if(!empty($_SESSION))
        {
            $data = [ 'id' => $_SESSION['user']['id'] ];

            // Destruir todas las variables de sesión.
            $_SESSION = array();

            // Si se desea destruir la sesión completamente, borre también la cookie de sesión.
            // Nota: ¡Esto destruirá la sesión, y no la información de la sesión!
            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000,
                    $params["path"], $params["domain"],
                    $params["secure"], $params["httponly"]
                );
            }

            // Finalmente, destruir la sesión.
            session_destroy();

            $error = null;
        }

        return $this->_respJSON($data, null, $error);
    }

    protected function register()
    {
       $this->store(null);
    }
}
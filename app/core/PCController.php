<?php

namespace App\Core;

class PCController 
{
    function __construct()
    {
        //var_dump($_SERVER);
        //var_dump($this->_getJSONBody());
    }

    function processRequest($id)
    {
        switch ($_SERVER["REQUEST_METHOD"]) 
        {
            case 'GET':
                $this->index($id);
                break;
            case 'POST':
                $this->store($id);
                break;
            case 'PUT':
                $this->update($id);
                break;
            case 'DELETE':
                $this->delete($id);
                break;
            
            default:
                throw new Exception('Verbo HTTP no soportado');
                break;
        }
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
            //filter - por nombre y por correo
            $data = call_user_func("{$this->strModel}::all");
        }

        return $this->_respJSON($data);
    }

    function store($id)
    {
        $error = 'Llamado erroneo, verifique el end point.';
        $data = null;

        if(empty($id))
        {
            $arrData = $this->_getJSONBody(true);
            
            $keys = array_keys($arrData);
        
            $insModel = new $this->strModel;

            foreach ($keys as $key => $value) 
            {
                if($value != $this->strID)
                    $insModel[$value] = $arrData[$value];
            }

            $insModel->save();

            $data = [$this->strID => $insModel->getKey()];

            $error = null;
        }

        return $this->_respJSON($data, null, $error);
    }

    function update($id)
    {
        $error = 'Llamado erroneo, verifique el end point.';
        $data = null;

        if(!empty($id))
        {
            $insModel = call_user_func("{$this->strModel}::find", $id);   

            if(empty($insModel))
            {
                $error = 'Recurso no encontrado';
            }
            else
            {
                $arrData = $this->_getJSONBody(true);
            
                $keys = array_keys($arrData);

                foreach ($keys as $key => $value) 
                {
                    $insModel[$value] = $arrData[$value];
                }

                $insModel->save();

                $data = [$this->strID => $insModel->getKey()];

                $error = null;
            }
        }

        return $this->_respJSON($data, null, $error);
    }

    function delete($id)
    {
        $error = 'Llamado erroneo, verifique el end point.';
        $data = null;

        if(!empty($id))
        {
            $insModel = call_user_func("{$this->strModel}::find", $id);   

            if(empty($insModel))
            {
                $error = 'Recurso no encontrado';
            }
            else
            {
                $insModel->delete();

                $data = [$this->strID => $insModel->getKey()];

                $error = null;
            }
        }

        return $this->_respJSON($data, null, $error);
    }

    protected function _getJSONBody(bool $assoc = false ) 
    {
        $rawInput = fopen('php://input', 'r');
        $tempStream = fopen('php://temp', 'r+');
        stream_copy_to_stream($rawInput, $tempStream);
        rewind($tempStream);

        return json_decode( stream_get_contents($tempStream), $assoc );
    }

    protected function _respJSON($data = null, $pagination = null, $error = null)
    {
        $arrResp = array('error' => 'Error desconocido.');

        if(!is_null($error))
        {
            $arrResp['error'] = $error;
        }

        if(!is_null($data))
        {
            $arrResp['data'] = $data;

            unset($arrResp['error']);
        }

        if(!is_null($pagination))
        {
            $arrResp['pagination'] = $pagination;
        }

        header('Content-Type: application/json');
        if(!empty($arrResp['error'])) header($_SERVER["SERVER_PROTOCOL"] . " 500 " . $error);
        echo json_encode($arrResp);
    }

}
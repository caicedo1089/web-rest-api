<?php

namespace App\Core;

use Illuminate\Database\Eloquent\Model as Eloquent;

class PCModel extends Eloquent 
{
    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $dates = ['created_at', 'updated_at', 'deleted_at'];
    
    protected $dateFormat = 'Y-m-d H:i:s';
    
    /*public function getDateFormat()
    {
        return 'Y-m-d H:i:s.u';
    }

    public function fromDateTime($value)
    {
        return substr(parent::fromDateTime($value), 0, -3);
    }*/
}
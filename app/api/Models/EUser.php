<?php 

namespace App\Api\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Core\PCModel;

class EUser extends PCModel 
{
    use SoftDeletes;

    protected  $table = "users";

    protected $hidden = ['password'];

    public function setPasswordAttribute($pass)
    {
        $this->attributes['password'] = md5($pass);
    }

}
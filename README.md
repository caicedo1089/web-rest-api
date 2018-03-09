# Web API Rest - PHP

Web API Rest es un micro framework que muestra la creación y uso de un API Rest. Además tiene un pequeño Auth que permite la autenticación de usuarios. Está basado en Eloquent para el manejo de los modelos, [PHP Router](https://github.com/emilio/php-router) para el manejo de las rutas y [PHP Dotenv](https://github.com/vlucas/phpdotenv) para manejar las configuraciones. 

La estructura de carpeta es muy simple, cómo se muestra a continuación:

* app/ Almacena la API y la Web, y una carpeta core donde se almacena las clases bases de los modelos y controladores de la API.
* config/ Almacena todas las configuraciones principales.
* public/ Almacena todos los archivos assets que serán publicos, en este caso está el Fornt End, realizado en [ExtJS 4.2.1](http://docs.sencha.com/extjs/4.2.1/#!/api).

## Demostración

![Demostración](https://github.com/caicedo1089/web-rest-api/blob/master/public/img/CRUD.gif)

## Instalación
* Clone el proyecto.
* Ubiquese dentro de la carpeta y ejecute el siguiente comando [composer](https://getcomposer.org/):
```
composer install
```
* En el proyecto está el archivo users.sql, importelo en su BD, probado solamente en BD [MySQL](https://www.mysql.com/).
* En el archivo .env agrege los datos de conexión de su BD.
* Para terminar levantaremos un servidor http para probar el proyecto, para esto ejecute el comando:
```
php -S localhost:8000
```

Al abrir en el navegador(browser) nuestra web en [localhost:8000](localhost:8000) podemos acceder al proyecto. En el [/api](localhost:8000/api/)  podemos acceder a la API y en [/web](localhost:8000/web/) podemos acceder a la web.

## API Access Points

Este proyecto sólo tiene estos dos end points:

###AUTH:

Manejo de la autenticación.

* POST /api/auth/login
```
//JSON Request
{
    "login": "correo@dominio.com",
    "password": "123456"
}

//JSON Response - 200
{
    "data": {
        "id": 29,
        "full_name": "Pedro Caicedo",
        "username": "pcaicedo",
        "email": "info@pcaicedo.com",
        "remember_token": null,
        "created_at": "-0001-11-30 00:00:00",
        "updated_at": "-0001-11-30 00:00:00",
        "deleted_at": null
    }
}
```
* POST /api/auth/register
```
//JSON Request
{
    "full_name": "Pedro Caicedo",
    "username": "caicedo1089",
    "email": "correo@dominio.com",
    "password": "123456"
}

//JSON Response - 200
{
    "data": {
        "id": 31
    }
}
```
* GET /api/auth/logout
```
//JSON Request - No aplica

//JSON Response - 200
{
    "data": {
        "id": 29
    }
}
```

###USERS:

CRUD de los usuarios del sistema.

* GET /api/users/
```
//JSON Request

?filter=<Filtra por nombre, username o correo>

//JSON Response - 200
{
    "data": [
        {
            "id": 28,
            "full_name": "José Caicedo",
            "username": "caicer",
            "email": "caicer",
            "remember_token": null,
            "created_at": "2018-03-05 06:01:48",
            "updated_at": "-0001-11-30 00:00:00",
            "deleted_at": null
        }
    ]
}
```

* POST /api/users/
```
//JSON Request
{
    "full_name": "Pedro Caicedo",
    "username": "caicedo1089",
    "email": "correo@dominio.com",
    "password": "123456"
}

//JSON Response - 200
{
    "data": {
        "id": 31
    }
}
```

* PUT /api/users/<id_user>
Todos los parametros de la solicitud (request) son opcionales, ea decir si sólo queremos actualizar el nombre sólo enviamos el parametro full_name en el JSON.
```
//JSON Request
{
    "full_name": "Otro Nombre", 
    "username": "caicedo1089_CO",
    "email": "correo@dominio.com.co",
    "password": "1234567"
}

//JSON Response - 200
{
    "data": {
        "id": 31
    }
}
```

* DELETE /api/users/<id_user>
```
//JSON Request - No aplica

//JSON Response - 200
{
    "data": {
        "id": 31
    }
}
```

## Créditos
- [Pedro Caicedo](http://pcaicedo.com)

## Licencia

* [MIT](https://opensource.org/licenses/MIT) (BackEnd)
* [GPL v3](https://opensource.org/licenses/GPL-3.0) (FrontEnd)
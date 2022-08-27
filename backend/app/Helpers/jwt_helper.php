<?php

use App\Models\UsuarioModel;
use Config\Services;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
/**
* La función getJWTFromRequest comprueba el encabezado de autorización 
* de la solicitud entrante y devuelve el valor del token. Si falta 
* el encabezado, genera una excepción que, a su vez, hace que
* HTTP_UNAUTHORIZED se devuelva una respuesta (401).
*/
function getJWTFromRequest($authenticationHeader): string
{
    if (is_null($authenticationHeader)) { //JWT ausente
        throw new Exception('Falta el token o no es válida la solicitud');
    }
    $respuesta=explode(' ', $authenticationHeader);
    //JWT Se envía desde el cliente en el formato Bearer XXXXXXXXX
    return $respuesta[0];
}
/**
* La función validateJWTFromRequest toma el token obtenido por la 
* función getJWTFromRequest. Decodifica este token para obtener la 
* usuario con la que se generó la clave. Luego intenta 
* encontrar un usuario con esa identificación en la 
* base de datos. Si no se encontró al usuario, el modelo de usuario 
* genera una excepción que se detecta y se devuelve al usuario como una 
* HTTP_UNAUTHORIZED respuesta (401).
*/
function validateJWTFromRequest(string $encodedToken)
{
    $key = Services::getSecretKey();
    $decodedToken = JWT::decode($encodedToken, new key ($key, 'HS256'));
    $userModel=new UsuarioModel();
    $userModel->obtenerSession($decodedToken->username);
}
/**
* La función getSignedJWTForUser genera un token para 
* un usuario autenticado. El JWT codificado contiene los siguientes 
* detalles:
*  + La identificación del usuario autenticado. Esto se utiliza en 
*   solicitudes posteriores para validar el origen de la solicitud.
*  + La hora en que se generó el token ( iat).
*  + El momento en que expira el token (exp). Esto se obtiene agregando 
*   el valor de nuestro archivo .env JWT_TIME_TO_LIVE  a la hora actual.
*/
function getSignedJWTForUser(string $username)
{
    $issuedAtTime = time();
    $tokenTimeToLive = getenv('JWT_TIME_TO_LIVE');
    $tokenExpiration = $issuedAtTime + $tokenTimeToLive;
    $userModel=new UsuarioModel();
    $user=$userModel->obtenerSession($username);
    $payload = [
        'username' => $username,
        'rol' => $user['nombreRol'],
        'iat' => $issuedAtTime,
        'exp' => $tokenExpiration,
    ];
    $jwt = JWT::encode($payload, Services::getSecretKey(),'HS256');
    return $jwt;
}
/**
 * La función getRolJWTFromRequest obtiene el rol y username del usuario
 */
function getSesionJWTFromRequest(string $encodedToken)
{
    $key = Services::getSecretKey();
    $decodedToken = JWT::decode($encodedToken, new key ($key, 'HS256'));
    return $decodedToken;
}
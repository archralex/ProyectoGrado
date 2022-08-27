<?php

namespace App\Filters;

use CodeIgniter\API\ResponseTrait;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;
use Exception;
class JWTAuthenticationFilter implements FilterInterface
{
    use ResponseTrait;

    public function before(RequestInterface $request, $arguments = null)
    {
        $authenticationHeader = $request->getServer('HTTP_AUTHORIZATION');
        if(!$authenticationHeader){
            $authenticationHeader = $request->getPost('token');
        }
        try {
            if($authenticationHeader==""){
                throw new Exception('Falta el token');
            }
            helper('jwt');
            $encodedToken = getJWTFromRequest($authenticationHeader);
            validateJWTFromRequest($encodedToken);
            return $request;
        } catch (Exception $e) {
            $mensaje=$e->getMessage();
            if($mensaje=='Expired token'){
                $mensaje="Token Expirado";
            }
            if ($mensaje=='Signature verification failed') {
                $mensaje="Verificación de firma fallida";
            }
            if ($mensaje=='Wrong number of segments') {
                $mensaje="Número incorrecto de segmentos";
            }
            if ($mensaje=='Key may not be empty') {
                $mensaje="La llave no puede estar vacía";
            }
            //e02=respuesta de errores de tokens invalidos
            return Services::response()->setJSON(['ok' => false,
                                                  'message'=>$mensaje])
                                       ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);

        }
    }

    public function after(RequestInterface $request,ResponseInterface $response,$arguments = null){
    }
}
<?php

namespace App\Controllers\API;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\Response;
use CodeIgniter\HTTP\ResponseInterface;
use Exception;
use ReflectionException;
class ExpireTokenController extends BaseController
{
    public function index()
    {
         //validar si ya expiro el json web token
        try {
            $token = $this->request->getHeaderLine('Authorization');
            if(!$token){
                return $this->getResponse(
                    [
                        'ok' => false,
                        'msg' => 'Token no encontrado'
                    ],
                    ResponseInterface::HTTP_UNAUTHORIZED
                );
            }
            $issuedAtTime = time();
            $decodetoken=getSesionJWTFromRequest($token);
            if(!isset($decodetoken->exp)){
                return $this->getResponse(
                    [
                        'ok' => false,
                        'msg' => 'Token inválido'
                    ],
                    ResponseInterface::HTTP_UNAUTHORIZED 
                );
            }
            return $this->getResponse(
                [
                    'ok' => true,
                    'msg' => 'Token válido'
                ]
            );
        } catch (Exception $e) {
            if($e->getMessage()=="Expired token"){
                return $this->getResponse(
                    [
                        'ok' => false,
                        'msg' => 'Token expirado'
                    ],
                    ResponseInterface::HTTP_UNAUTHORIZED 
                );
            }
        }
         
    }
}

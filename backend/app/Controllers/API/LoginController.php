<?php

namespace App\Controllers\API;

use CodeIgniter\HTTP\Response;
use CodeIgniter\HTTP\ResponseInterface;
use Exception;
use ReflectionException;
use App\Controllers\BaseController;
use App\Models\{
    PersonaModel,
    UsuarioModel
};
/**
 * [Controlador que permite la creación de tokens para validación de usuario]
 */
class LoginController extends BaseController
{

	protected $format = 'json';

	 /**
     * Autentica si un usuario existe
     * @return Response
     */
    public function login()
    {
        $rules = [
            'password' => 'required|validateUser[username, password]'
        ];

        $errors = [
            'password' => [
                'validateUser' => 'Credenciales invalidas'
            ]
        ];
		$input = $this->getRequestInput($this->request);
        if (!$this->validateRequest($input, $rules, $errors)) {
            $error= $this->validator->getErrors();
            if($error['password']=="The msg field is required."){
                $error['password']="Credenciales invalidas";
            }
            return $this->getResponse(
                [
                'ok'=>false,
                'msg'=>isset($errors['password']['validateUser'])?$errors['password']['validateUser']:$errors['password']
                ],
                    ResponseInterface::HTTP_BAD_REQUEST
                );
        }
       return $this->getJWTForUser($input['username']);


    }
    /**
     * Genera el token y lo regresar como respuesta en una petición request
     */
    private function getJWTForUser(string $username,int $responseCode = ResponseInterface::HTTP_OK)
    {
        try {
            $userModel=new UsuarioModel();
            $user = $userModel->obtenerSession($username);
            unset($user['password']);
            unset($user['username']);
            $user['token']=getSignedJWTForUser($username);
            $user['ok']=true;
            return $this->getResponse($user);
        } catch (Exception $exception) {
            //e01: error de acceso al login
            return $this->getResponse(
										[
                                            'ok'=>false,
											'error' => $exception->getMessage(),
										],
										     $responseCode
									);
        }
    }
    /**
     * Comprueba si existe una persona dada su identificación.
     */
    public function personaIdentificacion(string $identificacion=null){
        if ($identificacion==null) {
            $identificacion = $this->request->getPost('identificacion');
        }
        $personaModel=new PersonaModel();
        $persona=$personaModel->existePersona($identificacion);
        if($persona){
            return $this->getResponse(['msj'=>'OK']);
        }
        return $this->getResponse(['msj'=>'BAD']);
    } 
}
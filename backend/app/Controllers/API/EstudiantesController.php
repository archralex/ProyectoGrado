<?php

namespace App\Controllers\API;

use CodeIgniter\HTTP\Response;
use CodeIgniter\HTTP\ResponseInterface;
use Exception;
use ReflectionException;
use App\Controllers\BaseController;
use App\Models\{
    PersonaModel,
    UsuarioModel,
    RolModel
};
/**
 * [Controlador que permite la creación de tokens para validación de usuario]
 */
class EstudiantesController extends BaseController
{

    public function mostrar()
    {
        try {
            $PersonaModel = new PersonaModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->token)){
                $infoTable->token= $this->request->getServer('HTTP_AUTHORIZATION');
            }
            $session=getSesionJWTFromRequest($infoTable->token);
            if(!isset($session->rol)){
                throw new Exception("Rol de usuario incorrecto", 1);
            }
            if($session->rol!="ADMINISTRADOR"){
                throw new Exception("No tiene privilegios para acceder a esta información", 1);
            }
            $students = $PersonaModel->getStudents($infoTable);
            $total    = $PersonaModel->getStudents($infoTable, true);
            return $this->getResponse(
                [
                    'status' => 200,
                    'personas' => $students,
                    'total' => $total
                ]
            );
        } catch (Exception $e) {
            if($e->getCode()==1){
                return $this->getResponse(
                    [
                        'status' => 404,
                        'message' => $e->getMessage()
                    ]
                );
            }
            return $this->getResponse(
                [
                    'status' => 'BAD',
                    'error' => $e->getMessage()
                ],
                ResponseInterface::HTTP_BAD_REQUEST
            );
        }
    }
    public function guardar(){
        try {
            $PersonaModel = new PersonaModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->tipoId) or empty($infoTable->tipoId)){
                throw new Exception("El tipo de documento no puede estar vacío", 1);
            }
            $infoTable->tipo_documento=$infoTable->tipoId;
            unset($infoTable->tipoId);
            if(!isset($infoTable->identificacion) or empty($infoTable->identificacion)){
                throw new Exception("La identificación no puede estar vacía", 1);
            }
            if(!isset($infoTable->nombres) or empty($infoTable->nombres)){
                throw new Exception("El campo nombres no puede estar vacío", 1);
            }
            if(!isset($infoTable->token)){
                $infoTable->token= $this->request->getServer('HTTP_AUTHORIZATION');
            }
            $session=getSesionJWTFromRequest($infoTable->token);
            if(!isset($session->rol)){
                throw new Exception("Rol de usuario incorrecto", 1);
            }
            if($session->rol!="ADMINISTRADOR"){
                throw new Exception("No tiene privilegios para acceder a esta información", 1);
            }
            $existe=$PersonaModel->findPersona($infoTable);
            if($existe){
                throw new Exception("Ya existe una persona con estos datos", 1);
            }
            $config['varName'] = 'foto';
            $infoFoto=null;
            if(haveFile($config)){
                $imageConfig['inputName']  = 'foto';
                $imageConfig['max_size']   = '200';
                $imageConfig['max_width']  = '300';
                $imageConfig['max_height'] = '300';
                $rules    = ['foto' => getRuleImage($imageConfig)];
                $errors   = ['foto' => getMessageErrorsImage()];
                if (!$this->validate($rules, $errors)) {
                    $error=$this->validator->getErrors();
                    if($error['foto']=="no tiene las dimensiones correctas."){
                        throw new Exception('La foto debe tener dimensiones de 300x300 como maximo', 1);
                    }
                    throw new Exception('La foto '.$error['foto'], 1);
                }
                $infoFoto=toBase64($config);
            }
            if($infoFoto){
                $infoTable->foto = $infoFoto;
            }
            $persona = $PersonaModel->guardar($infoTable);
            if(!$persona ){
                throw new Exception("No se pudo guardar el registro", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Persona guardada correctamente'
                ]
            );
        } catch (Exception $e) {
            if($e->getCode()==1){
                return $this->getResponse(
                    [
                        'status' => 404,
                        'message' => $e->getMessage()
                    ]
                );
            }
            return $this->getResponse(
                [
                    'status' => 'BAD',
                    'message' => $e->getMessage()
                ],
                ResponseInterface::HTTP_BAD_REQUEST
            );
        }
    }
    public function editar(){
        try {
            $PersonaModel = new PersonaModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->tipoId) or empty($infoTable->tipoId)){
                throw new Exception("El tipo de documento no puede estar vacío", 1);
            }
            $infoTable->tipo_documento=$infoTable->tipoId;
            unset($infoTable->tipoId);
            if(!isset($infoTable->identificacion) or empty($infoTable->identificacion)){
                throw new Exception("La identificación no puede estar vacía", 1);
            }
            if(!isset($infoTable->nombres) or empty($infoTable->nombres)){
                throw new Exception("El campo nombres no puede estar vacío", 1);
            }
            if(!isset($infoTable->apellidos) or empty($infoTable->apellidos)){
                throw new Exception("El campo apellidos no puede estar vacío", 1);
            }
            if(!isset($infoTable->celular) or empty($infoTable->celular)){
                throw new Exception("El número de celular no puede estar vacio", 1);
            }
            if(!isset($infoTable->token)){
                $infoTable->token= $this->request->getServer('HTTP_AUTHORIZATION');
            }
            $session=getSesionJWTFromRequest($infoTable->token);
            if(!isset($session->rol)){
                throw new Exception("Rol de usuario incorrecto", 1);
            }
            if($session->rol!="ADMINISTRADOR"){
                throw new Exception("No tiene privilegios para acceder a esta información", 1);
            }
            $config['varName'] = 'foto';
            $infoFoto=null;
            if(haveFile($config)){
                $imageConfig['inputName']  = 'foto';
                $imageConfig['max_size']   = '200';
                $imageConfig['max_width']  = '300';
                $imageConfig['max_height'] = '300';
                $rules    = ['foto' => getRuleImage($imageConfig)];
                $errors   = ['foto' => getMessageErrorsImage()];
                if (!$this->validate($rules, $errors)) {
                    $error=$this->validator->getErrors();
                    if($error['foto']=="no tiene las dimensiones correctas."){
                        throw new Exception('La foto debe tener dimensiones de 300x300 como maximo', 1);
                    }
                    throw new Exception('La foto '.$error['foto'], 1);
                }
                $infoFoto=toBase64($config);
            }
            if($infoFoto){
                $infoTable->foto = $infoFoto;
            }
            $existe=$PersonaModel->findPersona($infoTable);
            if($existe){
                if($existe["id"]!=$infoTable->id){
                    throw new Exception("Ya existe una persona con estos datos", 1);
                }
            }
            $persona = $PersonaModel->actualizar($infoTable);
            if(!$persona ){
                throw new Exception("No se pudo guardar el registro", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Persona guardada correctamente'
                ]
            );
        } catch (Exception $e) {
            if($e->getCode()==1){
                return $this->getResponse(
                    [
                        'status' => 404,
                        'message' => $e->getMessage()
                    ]
                );
            }
            return $this->getResponse(
                [
                    'status' => 'BAD',
                    'message' => $e->getMessage()
                ],
                ResponseInterface::HTTP_BAD_REQUEST
            );
        }
    }
    public function eliminar(){
        try {
            $PersonaModel = new PersonaModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->token)){
                $infoTable->token= $this->request->getServer('HTTP_AUTHORIZATION');
            }
            $session=getSesionJWTFromRequest($infoTable->token);
            if(!isset($session->rol)){
                throw new Exception("Rol de usuario incorrecto", 1);
            }
            if($session->rol!="ADMINISTRADOR"){
                throw new Exception("No tiene privilegios para acceder a esta información", 1);
            }
            $persona = $PersonaModel->eliminar($infoTable);
            if(!$persona ){
                throw new Exception("No se pudo eliminar el registro", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Persona eliminada correctamente'
                ]
            );
        } catch (Exception $e) {
            if($e->getCode()==1){
                return $this->getResponse(
                    [
                        'status' => 404,
                        'message' => $e->getMessage()
                    ]
                );
            }
            return $this->getResponse(
                [
                    'status' => 'BAD',
                    'message' => $e->getMessage()
                ],
                ResponseInterface::HTTP_BAD_REQUEST
            );
        }
    }
    public function actualizarCorreoFoto(){
        try {
            $PersonaModel = new PersonaModel();
            $usuarioModel=new UsuarioModel();
            $infoTable=$this->request->getVar();
            $infotable=setNull($infoTable);
            $infoTable=(object)$infoTable;
            if(!isset($infoTable->token)){
                $infoTable->token= $this->request->getServer('HTTP_AUTHORIZATION');
            }
            if(!isset($infoTable->correo)){
                throw new Exception("El correo no puede estar vacío", 1);
            }
            if(!correoValido($infoTable->correo)){
                throw new Exception("El correo no tiene un formato valido", 1);
            }
            $config['varName'] = 'foto';
            $infoFoto=null;
            if(haveFile($config)){
                $imageConfig['inputName']  = 'foto';
                $imageConfig['max_size']   = '200';
                $imageConfig['max_width']  = '300';
                $imageConfig['max_height'] = '300';
                $rules    = ['foto' => getRuleImage($imageConfig)];
                $errors   = ['foto' => getMessageErrorsImage()];
                if (!$this->validate($rules, $errors)) {
                    $error=$this->validator->getErrors();
                    if($error['foto']=="no tiene las dimensiones correctas."){
                        throw new Exception('La foto debe tener dimensiones de 300x300 como maximo', 1);
                    }
                    throw new Exception('La foto '.$error['foto'], 1);
                }
                $infoFoto=toBase64($config);
            }
            if($infoFoto){
                $infoTable->foto = $infoFoto;
            }
            $persona = $PersonaModel->actualizar($infoTable);
            if(!$persona ){
                throw new Exception("No se pudo guardar el registro de persona", 1);
            }
            $usuario=(object)["id"=>$infoTable->idUsuario,"correo"=>$infoTable->correo];
            $usuario=$usuarioModel->actualizar($usuario);
            if(!$usuario ){
                throw new Exception("No se pudo guardar el registro de usuario", 1);
            }
            if(setNull(['foto' =>$infoTable->foto])['foto']!=null){
                return $this->getResponse(
                    [
                        'status'  => 200,
                        'message' => 'Persona guardada correctamente',
                        'foto'    => $infoTable->foto
                        
                    ]
                );
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Persona guardada correctamente'
                    
                ]
            );
        } catch (Exception $e) {
            if($e->getCode()==1){
                return $this->getResponse(
                    [
                        'status' => 404,
                        'message' => $e->getMessage()
                    ]
                );
            }
            return $this->getResponse(
                [
                    'status' => 'BAD',
                    'message' => $e->getMessage()
                ],
                ResponseInterface::HTTP_BAD_REQUEST
            );
        }
    }
}
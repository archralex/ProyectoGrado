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
    RolModel,

};
class UsuarioController extends BaseController
{

    public function mostrar()
    {
        try {
            $UsuarioModel = new UsuarioModel();
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
            $usuarios = $UsuarioModel->getUsuarios($infoTable);
            $total   = $UsuarioModel->getUsuarios($infoTable, true);
            return $this->getResponse(
                [
                    'status' => 'OK',
                    'usuarios' => $usuarios,
                    'total' => $total
                ]
            );
        } catch (Exception $e) {
            if($e->getCode()==1){
                return $this->getResponse(
                    [
                        'status' => 'OK',
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
            $UsuarioModel = new UsuarioModel();
            $personaModel = new PersonaModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->identificacion) or empty($infoTable->identificacion)){
                throw new Exception("No se ha seleccionado una persona", 1);
            }
            $tieneUsuario=$UsuarioModel->findUsuarioByIdentificacion($infoTable);
            if($tieneUsuario){
                throw new Exception("La persona ya tiene un usuario asociado", 1);
            }
            $persona=$personaModel->findPersona($infoTable);
            if(!$persona){
                throw new Exception("No existe una persona para esa identificacion, por favor registrela", 1);
            }
            if(!isset($infoTable->username) or empty($infoTable->username)){
                throw new Exception("Se debe asignar un usuario", 1);
            }
            if(!isset($infoTable->password) or empty($infoTable->password)){
                throw new Exception("Se debe asignar una contraseña", 1);
            }
            if(!isset($infoTable->correo) or empty($infoTable->correo)){
                throw new Exception("Se debe asignar un correo", 1);
            }
            if(!correoValido($infoTable->correo)){
                throw new Exception("El correo no es válido", 1);
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
            $infoTable->persona=$persona['id'];
            $infoTable->rol=3;
            $existe=$UsuarioModel->findUsuario($infoTable);
            if($existe){
                throw new Exception("Ya existe un usuario con este nombre", 1);
            }
            $infoTable->password=hashPassword512($infoTable->password);
            $usuario = $UsuarioModel->guardar($infoTable);
            if(!$usuario ){
                throw new Exception("No se pudo guardar el registro", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Registro guardado correctamente'
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
            $UsuarioModel = new UsuarioModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->persona) or empty($infoTable->persona)){
                throw new Exception("No se ha seleccionado una persona", 1);
            }
            if(!isset($infoTable->username) or empty($infoTable->username)){
                throw new Exception("Se debe asignar un usuario", 1);
            }
            if(!isset($infoTable->password) or empty($infoTable->password)){
                throw new Exception("Se debe asignar una contraseña", 1);
            }
            if(!isset($infoTable->correo) or empty($infoTable->correo)){
                throw new Exception("Se debe asignar un correo", 1);
            }
            if(!correoValido($infoTable->correo)){
                throw new Exception("El correo no es válido", 1);
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
            $existe=$UsuarioModel->findUsuario($infoTable);
            if($existe){
                if($existe['id']!=$infoTable->id){
                    throw new Exception("Ya existe un usuario con estos datos", 1);
                }
            }
            if(isset($infoTable->password) and !empty($infoTable->password)){
                $infoTable->password=hashPassword512($infoTable->password);
            }else{
                unset($infoTable->password);
            }
            $infoTable->rol=3;
            $usuario = $UsuarioModel->actualizar($infoTable);
            if(!$usuario ){
                throw new Exception("No se pudo guardar el registro", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Registro guardado correctamente'
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
            $UsuarioModel = new UsuarioModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->id) or empty($infoTable->id)){
                throw new Exception("No se ha seleccionado un registro", 1);
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
            $curso = $UsuarioModel->eliminar($infoTable);
            if(!$curso ){
                throw new Exception("No se pudo eliminar el curso", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Usuario eliminado correctamente'
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
<?php

namespace App\Controllers\API;

use CodeIgniter\HTTP\Response;
use CodeIgniter\HTTP\ResponseInterface;
use Exception;
use ReflectionException;
use App\Controllers\BaseController;
use App\Models\{
    InscripcionModel,
    UsuarioModel,
};
class InscripcionController extends BaseController
{

    public function mostrar()
    {
        try {
            $InscripcionModel = new InscripcionModel();
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
            $inscripciones = $InscripcionModel->getInscripciones($infoTable);
            $total   = $InscripcionModel->getInscripciones($infoTable, true);
            return $this->getResponse(
                [
                    'status' => 'OK',
                    'matriculas' => $inscripciones,
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
            $InscripcionModel = new InscripcionModel();
            $usuarioModel = new UsuarioModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->curso) or empty($infoTable->curso)){
                throw new Exception("No se ha seleccionado un curso", 1);
            }
            if(!isset($infoTable->identificacion) or empty($infoTable->identificacion)){
                throw new Exception("No se ha ingresado una identificacion", 1);
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
            $usuario=$usuarioModel->findUsuarioByIdentificacion($infoTable);
            if(!$usuario){
                throw new Exception("No se le ha asignado un usuario al estudiante o la identificacion dada es erronea", 1);
            }
            $infoTable->usuario=intval($usuario['id']);
            $existe=$InscripcionModel->findMatricula($infoTable);
            if($existe){
                throw new Exception("Ya existe una matricula para este usuario con las selecciones dadas", 1);
            }
            $Inscripcion = $InscripcionModel->guardar($infoTable);
            if(!$Inscripcion ){
                throw new Exception("No se pudo guardar el registro", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Matricula guardada correctamente'
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
            $InscripcionModel = new InscripcionModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->curso) or empty($infoTable->curso)){
                throw new Exception("No se ha seleccionado un curso", 1);
            }
            if(!isset($infoTable->usuario) or empty($infoTable->usuario)){
                throw new Exception("No se ha seleccionado un usuario", 1);
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
            $existe=$InscripcionModel->findMatricula($infoTable);
            if($existe){
                if($existe['id']!=$infoTable->id){
                    throw new Exception("Ya existe una matricula para este usuario con las selecciones dadas", 1);
                }
            }
            $Inscripcion = $InscripcionModel->actualizar($infoTable);
            if(!$Inscripcion ){
                if($existe['id']!=$infoTable->id){
                    throw new Exception("Ya existe un usuario con estos datos", 1);
                }
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Matricula editada correctamente'
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
            $InscripcionModel = new InscripcionModel();
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
            $curso = $InscripcionModel->eliminar($infoTable);
            if(!$curso ){
                throw new Exception("No se pudo eliminar la matricula", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Matricula eliminada correctamente'
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
    public function getCursos(){
        try {
            $InscripcionModel = new InscripcionModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->token)){
                $infoTable->token= $this->request->getServer('HTTP_AUTHORIZATION');
            }
            $session=getSesionJWTFromRequest($infoTable->token);
            if(!isset($session->rol)){
                throw new Exception("Rol de usuario incorrecto", 1);
            }
            if($session->rol!="ESTUDIANTE"){
                throw new Exception("No tiene privilegios para acceder a esta información", 1);
            }
            $inscripciones = $InscripcionModel->getCursos($infoTable);
            $total   = $InscripcionModel->getCursos($infoTable, true);
            return $this->getResponse(
                [
                    'status' => 'OK',
                    'curso' => $inscripciones,
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
}
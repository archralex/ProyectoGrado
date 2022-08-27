<?php

namespace App\Controllers\API;

use CodeIgniter\HTTP\Response;
use CodeIgniter\HTTP\ResponseInterface;
use Exception;
use ReflectionException;
use App\Controllers\BaseController;
use App\Models\{
    ProgramasModel,
    programaProgramaModel
};
class ProgramasController extends BaseController
{

    public function mostrar()
    {
        try {
            $ProgramasModel = new ProgramasModel();
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
            $programas = $ProgramasModel->getPrograms($infoTable);
            $total   = $ProgramasModel->getPrograms($infoTable, true);
            return $this->getResponse(
                [
                    'status' => 'OK',
                    'programas' => $programas,
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
            $ProgramasModel = new ProgramasModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->nombre) or empty($infoTable->nombre)){
                throw new Exception("Nombre del programa no puede estar vacío", 1);
            }
            if(!isset($infoTable->status) or empty($infoTable->status)){
                throw new Exception("El estado del programa no puede estar vacío", 1);
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
            $existe=$ProgramasModel->findPrograma($infoTable);
            if($existe){
                throw new Exception("Ya existe un programa con este nombre", 1);
            }
            $programas = $ProgramasModel->guardar($infoTable);
            if(!$programas){
                throw new Exception("No se pudo guardar el programa", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Programa guardado correctamente'
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
    public function editar(){
        try {
            $ProgramasModel = new ProgramasModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->nombre) or empty($infoTable->nombre)){
                throw new Exception("Nombre de programa no puede estar vacío", 1);
            }
            if(!isset($infoTable->status) or empty($infoTable->status)){
                throw new Exception("El estado del programa no puede estar vacío", 1);
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
            $existe=$ProgramasModel->findPrograma($infoTable);
            if($existe){
                if($existe['id']!=$infoTable->id){
                    throw new Exception("Ya existe un programa con este nombre", 1);
                }
            }
            $programa = $ProgramasModel->actualizar($infoTable);
            if(!$programa ){
                throw new Exception("No se pudo editar el programa", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Programa guardado correctamente'
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
            $ProgramasModel = new ProgramasModel();
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
            $programa = $ProgramasModel->eliminar($infoTable);
            if(!$programa ){
                throw new Exception("No se pudo eliminar el programa", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Programa eliminado correctamente'
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
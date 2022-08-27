<?php

namespace App\Controllers\API;

use CodeIgniter\HTTP\Response;
use CodeIgniter\HTTP\ResponseInterface;
use Exception;
use ReflectionException;
use App\Controllers\BaseController;
use App\Models\{
    PersonaModel,
    CursoModel,
    RolModel,
    ProgramasModel,
    CursoProgramaModel,

};
class CursosController extends BaseController
{

    public function mostrar()
    {
        try {
            $CourseModel = new CursoModel();
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
            $courses = $CourseModel->getCourses($infoTable);
            $total   = $CourseModel->getCourses($infoTable, true);
            return $this->getResponse(
                [
                    'status' => 200,
                    'curso' => $courses,
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
            $CursoModel = new CursoModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->nombre) or empty($infoTable->nombre)){
                throw new Exception("Nombre de curso no puede estar vacío", 1);
            }
            if(!isset($infoTable->descripcion) or empty($infoTable->descripcion)){
                throw new Exception("Se debe asignar una descripción", 1);
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
            $existe=$CursoModel->findCurso($infoTable);
            if($existe){
                throw new Exception("Ya existe un curso con este nombre", 1);
            }
            $curso = $CursoModel->guardar($infoTable);
            if(!$curso ){
                throw new Exception("No se pudo guardar el curso", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Curso guardado correctamente'
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
    public function guardarAsociacion(){
        try {
            $ProgramasModel = new ProgramasModel();
            $cursoProgramasModel = new CursoProgramaModel();
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
            $existe=$cursoProgramasModel->findAsociacion($infoTable);
            if($existe){
                throw new Exception("Ya hay una asociación para este curso y el programa seleccionado", 1);
            }
            $cursoPrograma= $cursoProgramasModel->guardar($infoTable);
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Asociación guardada correctamente'
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
            $CursoModel = new CursoModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->nombre) or empty($infoTable->nombre)){
                throw new Exception("Nombre de curso no puede estar vacío", 1);
            }
            if(!isset($infoTable->descripcion) or empty($infoTable->descripcion)){
                throw new Exception("Se debe asignar una descripción", 1);
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
            $existe=$CursoModel->findCurso($infoTable);
            if($existe){
                if($existe['id']!=$infoTable->id){
                    throw new Exception("Ya existe un curso con este nombre", 1);
                }
            }
            $curso = $CursoModel->actualizar($infoTable);
            if(!$curso ){
                throw new Exception("No se pudo editar el curso", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Curso guardado correctamente'
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
    public function editarAsociacion(){
        try {
            $ProgramasModel = new ProgramasModel();
            $cursoProgramasModel = new CursoProgramaModel();
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
            $existe=$cursoProgramasModel->findAsociacion($infoTable);
            if($existe){
                if($existe['id']!=$infoTable->id){
                    throw new Exception("Ya hay una asociación para este curso y el programa seleccionado", 1);
                }
            }
            $cursoPrograma= $cursoProgramasModel->actualizar($infoTable);
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Asociación guardada correctamente'
                ]
            );
        } catch (Exception $e) {
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
            $CursoModel = new CursoModel();
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
            $curso = $CursoModel->eliminar($infoTable);
            if(!$curso ){
                throw new Exception("No se pudo eliminar el curso", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Curso eliminado correctamente'
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
    public function eliminarAsociacion(){
        try {
            $cursoProgramasModel = new CursoProgramaModel();
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
            $curso = $cursoProgramasModel->eliminar($infoTable);
            if(!$curso ){
                throw new Exception("No se pudo eliminar el curso", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Curso eliminado correctamente'
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
    public function cursos(){
        try {
            $CursoModel = new CursoModel();
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
            $cursos = $CursoModel->findCursos($infoTable);
            $total = $CursoModel->findCursos($infoTable,true);
            if(!$cursos ){
                throw new Exception("No se pudo obtener los cursos", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'curso' => $cursos,
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
                    'message' => $e->getMessage()
                ],
                ResponseInterface::HTTP_BAD_REQUEST
            );
        }
    } 
}
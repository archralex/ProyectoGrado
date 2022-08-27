<?php

namespace App\Controllers\API;

use CodeIgniter\HTTP\Response;
use CodeIgniter\HTTP\ResponseInterface;
use Exception;
use ReflectionException;
use App\Controllers\BaseController;
use App\Models\{
    ContenidosModel,
    UsuarioModel,
    DocumentosModel,
    ContenidosDocumentosModel
};
class ContenidosController extends BaseController
{

    public function mostrar(){
        try {
            $ContenidosModel = new ContenidosModel();
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
            $contenidos = $ContenidosModel->getContenidos($infoTable);
            $total   = $ContenidosModel->getContenidos($infoTable, true);
            return $this->getResponse(
                [
                    'status' => 'OK',
                    'contenidos' => $contenidos,
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
            $ContenidosModel = new ContenidosModel();
            $DocumentosModel = new DocumentosModel();
            $ContenidosDocumentosModel=new ContenidosDocumentosModel();
            $infoTable=(object)$this->request->getVar();
            if(!isset($infoTable->curso) or empty($infoTable->curso)){
                throw new Exception("No se ha seleccionado un curso", 1);
            }
            if(!isset($infoTable->tema) or empty($infoTable->tema)){
                throw new Exception("No se ha ingresado un tema", 1);
            }
            if(!isset($infoTable->descripcion) or empty($infoTable->descripcion)){
                throw new Exception("No se ha ingresado una descripcion", 1);
            }
            if(!isset($infoTable->status) or empty($infoTable->status)){
                throw new Exception("No se ha ingresado un estado", 1);
            }
            $config['varName'] = 'archivo';
            if(!haveFile($config)){
                throw new Exception("No se ha seleccionado un archivo", 1);
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
            $existe=$ContenidosModel->findContenido($infoTable);
            if($existe){
                throw new Exception("Ya existe un tema con el mismo nombre para este curso", 1);
            }
            $config['folio'] = 'temas';
            $infoArchivo     = agregarArchivoZip($config);
            $infoTable->documento=$DocumentosModel->guardar((object)['url'=>$infoArchivo['ruta']]);
            if(!$infoTable->documento){
                throw new Exception("No se pudo guardar el documento", 1);
            }
            $infoTable->contenido = $ContenidosModel->guardar($infoTable);
            if(!$infoTable->contenido ){
                throw new Exception("No se pudo guardar el registro", 1);
            }
            $infoTable->contenidoDocumento = $ContenidosDocumentosModel->guardar(
                (object)[
                    'contenido'=>$infoTable->contenido,
                    'documento'=>$infoTable->documento
                ]
            );
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Contenido guardado correctamente'
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
            $ContenidosModel = new ContenidosModel();
            $DocumentosModel = new DocumentosModel();
            $infoTable=(object)$this->request->getVar();
            if(!isset($infoTable->curso) or empty($infoTable->curso)){
                throw new Exception("No se ha seleccionado un curso", 1);
            }
            if(!isset($infoTable->tema) or empty($infoTable->tema)){
                throw new Exception("No se ha ingresado un tema", 1);
            }
            if(!isset($infoTable->descripcion) or empty($infoTable->descripcion)){
                throw new Exception("No se ha ingresado una descripcion", 1);
            }
            if(!isset($infoTable->status) or empty($infoTable->status)){
                throw new Exception("No se ha ingresado un estado", 1);
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
            $existe=$ContenidosModel->findContenido($infoTable);
            if($existe){
                if($existe['id']!=$infoTable->id){
                    throw new Exception("Ya existe un contenido para este tema", 1);
                }
            }
            $config['varName'] = 'archivo';
            if(haveFile($config)){
                $idDocumento=$existe['documento'];
                $documento=$DocumentosModel->findDocumento((object)[ 'id'=>$idDocumento]);
                if(!$documento){
                    throw new Exception("No se encontró el documento", 1);
                }
                $URL_DOCUMENT = getenv('app.uploadFiles');
                $URL_DOCUMENT =$URL_DOCUMENT.'/';
                $path = $URL_DOCUMENT.$documento['url'];
                $documento=eliminarDirectorio($path);
                if(!$documento){
                    throw new Exception("No se pudo eliminar el documento actual", 1);
                }
                $config['folio'] = 'temas';
                $infoArchivo     = agregarArchivoZip($config);
                $infoTable->documento=$DocumentosModel->actualizar((object)['url'=>$infoArchivo['ruta'], 'id'=>$idDocumento]);
                if(!$infoTable->documento){
                    throw new Exception("No se pudo guardar el documento", 1);
                }
            }
            
            $Contenido = $ContenidosModel->actualizar($infoTable);
            if(!$Contenido){
                throw new Exception("No se pudo actualizar el registro", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Contenido editado correctamente'
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
            $ContenidosModel = new ContenidosModel();
            $DocumentosModel = new DocumentosModel();
            $ContenidosDocumentosModel = new ContenidosDocumentosModel();
            $infoTable=(object)$this->request->getVar();
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
            $data=(object)['id'=>$infoTable->idContenidoDocumento];
            $contenidoDocumento=$ContenidosDocumentosModel->findContenidoDocumento($data);
            if(!$contenidoDocumento){
                throw new Exception("No se encontro el contenido", 1);
            }
            $idDocumento=(object)['id'=>$infoTable->idDocumento];
            $documento=$DocumentosModel->findDocumento($idDocumento);
            if(!$documento){
                throw new Exception("No se encontró el documento", 1);
            }
            $URL_DOCUMENT = getenv('app.uploadFiles');
            $URL_DOCUMENT =$URL_DOCUMENT.'/';
            $path = $URL_DOCUMENT.$documento['url'];
            $documento=eliminarDirectorio($path);
            if(!$documento){
                throw new Exception("No se pudo eliminar el documento", 1);
            }
            $contenidoDocumento=$ContenidosDocumentosModel->eliminar($data);
            if(!$contenidoDocumento){
                throw new Exception("No se pudo eliminar el contenido", 1);
            }
            $documento=$DocumentosModel->eliminar($idDocumento);
            if(!$documento){
                throw new Exception("No se pudo eliminar el documento", 1);
            }
            $contenido = $ContenidosModel->eliminar($infoTable);
            if(!$contenido ){
                throw new Exception("No se pudo eliminar el contenido", 1);
            }
            return $this->getResponse(
                [
                    'status' => 200,
                    'message' => 'Contenido eliminado correctamente'
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

    public function getContenidosPorCurso(){
        try {
            $ContenidosModel = new ContenidosModel();
            $infoTable=$this->request->getVar();
            if(!isset($infoTable->token)){
                $infoTable->token= $this->request->getServer('HTTP_AUTHORIZATION');
            }
            $contenidos = $ContenidosModel->getContenidosPorCurso($infoTable);
            $total   = $ContenidosModel->getContenidosPorCurso($infoTable, true);
            return $this->getResponse(
                [
                    'status' => 'OK',
                    'contenidos' => $contenidos,
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
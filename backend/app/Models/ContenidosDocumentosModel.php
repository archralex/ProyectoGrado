<?php
namespace App\Models;
use CodeIgniter\Model;
class ContenidosDocumentosModel extends Model
{
    protected $table      = 'contenidos_documentos';
    protected $primaryKey = 'id';
    protected $allowedFields = [
                                'id',
                                'contenido',
                                'documento',
                                'created_at', 
                                'updated_at', 
                                'deleted_at' 
                              ];
    protected $returnType = 'array';
    protected $useSoftDeletes = true;
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';
    
    public function getContenidos(object $infoTable, bool $paginate = false){
      $baseUrl = base_url();
      $answer=$this->select("
          contenidos.id,
          contenidos.tema,
          CONCAT('$baseUrl','/Documents/',doc.url) AS url,
          contenidos.descripcion,
          contenidos.status,
          curso.nombre as cursoNombre,
          curso.id as curso,
      ")->join("curso","curso.id=contenidos.curso")
        ->join("documentos doc","doc.id=contenidos.documento")
        ->where("curso.status","ACTIVO")
        ->where("contenidos.status","ACTIVO")
        ->where("curso.deleted_at is null")
        ->orderBy("contenidos.id","ASC");
  
      if($paginate){
          $answer = $answer->countAllResults();
      }else{
          $answer = $answer->findAll();
      }
      return $answer;
    }
    public function guardar(object $data){
      $answer=$this->insert($data);
      return $answer;
    }
    public function actualizar(object $data){
      $id=$data->id;
      unset($data->id);
      unset($data->token);
      $answer=$this->update($id,$data);
      return $answer;
    }
    public function eliminar(object $data){
      $answer=$this->delete($data->id);
      return $answer;
    } 
    public function findContenido(object $data){
      $answer=$this->where('tema',$data->tema)
                   ->where('curso',$data->curso)
                  ->first();
      return $answer;
    }
    public function findContenidoDocumento(object $data){
      $answer=$this->where('id',$data->id)
                  ->first();
      return $answer;
    }
}
?>
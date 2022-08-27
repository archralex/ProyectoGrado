<?php
namespace App\Models;
use CodeIgniter\Model;
class ContenidosModel extends Model
{
    protected $table      = 'contenidos';
    protected $primaryKey = 'id';
    protected $allowedFields = [
                                'id',
                                'curso',
                                'tema',
                                'descripcion',
                                'status',
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
          cd.id as idContenidoDocumento,
          doc.id as idDocumento,
      ")->join("curso","curso.id=contenidos.curso")
        ->join("contenidos_documentos cd","cd.contenido=contenidos.id")
        ->join("documentos doc","doc.id=cd.documento")
        ->where("curso.status","ACTIVO")
        ->where("contenidos.status","ACTIVO")
        ->where("curso.deleted_at is null")
        ->where('cd.deleted_at',null)
        ->where('doc.deleted_at',null)
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
      $data->status="INACTIVO";
      $id=$data->id;
      unset($data->id);
      $answer=$this->update($id,$data);
      $answer=$this->delete($id);
      return $answer;
    } 
    public function findContenido(object $data){
      $answer=$this->select("contenidos.id,doc.id as documento")
                   ->join("curso","curso.id=contenidos.curso")
                   ->join("contenidos_documentos cd","cd.contenido=contenidos.id")
                   ->join("documentos doc","doc.id=cd.documento")
                   ->where('tema',$data->tema)
                   ->where('curso',$data->curso)
                  ->first();
      return $answer;
    }
    public function findContenidoPorId(object $data){
      $answer=$this->select("contenidos.id,doc.id as documento")
                   ->join("curso","curso.id=contenidos.curso")
                   ->join("contenidos_documentos cd","cd.contenido=contenidos.id")
                   ->join("documentos doc","doc.id=cd.documento")
                   ->where('contenidos.id',$data->id)
                   ->where('cd.deleted_at',null)
                   ->where('doc.deleted_at',null)
                  ->first();
      return $answer;
    }
    public function getContenidosPorCurso(object $infoTable, bool $paginate = false){
      $baseUrl = base_url();
      $answer=$this->select("
          contenidos.id,
          contenidos.tema,
          CONCAT('$baseUrl','/Documents/',doc.url) AS url,
          contenidos.descripcion,
          contenidos.status,
          cd.id as idContenidoDocumento,
          doc.id as idDocumento,
      ")->join("curso","curso.id=contenidos.curso")
        ->join("contenidos_documentos cd","cd.contenido=contenidos.id")
        ->join("documentos doc","doc.id=cd.documento")
        ->where("curso.status","ACTIVO")
        ->where("curso.id",$infoTable->curso)
        ->where("curso.deleted_at is null")
        ->where('cd.deleted_at',null)
        ->where('doc.deleted_at',null)
        ->orderBy("contenidos.id","ASC");
  
      if($paginate){
          $answer = $answer->countAllResults();
      }else{
          $answer = $answer->findAll();
      }
      return $answer;
    }
}
?>
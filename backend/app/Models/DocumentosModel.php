<?php
namespace App\Models;
use CodeIgniter\Model;
class DocumentosModel extends Model
{
    protected $table      = 'documentos';
    protected $primaryKey = 'id';
    protected $allowedFields = [
                                'id',
                                'url',
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
          CONCAT('$baseUrl',doc.url) AS url,
          contenidos.status,
          curso.nombre as cursoNombre,
          curso.id as curso
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
      $data->status="INACTIVO";
      $id=$data->id;
      unset($data->id);
      $answer=$this->update($id,$data);
      $answer=$this->delete($id);
      return $answer;
    } 
    public function findDocumento(object $data){
      $answer=$this->where('id',$data->id)
                  ->first();
      return $answer;
    }
}
?>
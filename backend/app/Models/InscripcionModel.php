<?php
namespace App\Models;
use CodeIgniter\Model;
class InscripcionModel extends Model
{
    protected $table      = 'inscripcion';
    protected $primaryKey = 'id';
    protected $allowedFields = [
                                'id',
                                'curso',
                                'usuario',
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
    
    public function getInscripciones(object $infoTable, bool $paginate = false){
      $answer=$this->select("
          inscripcion.id,
          inscripcion.status,
          curso.nombre as cursoNombre,
          curso.id as curso,
          concat(p.nombres,' ',p.apellidos) as estudiante,
          p.identificacion,
          td.codigo as tipoId,
          user.id as usuario
      ")->join("curso","curso.id=inscripcion.curso")
        ->join("usuario as user","user.id=inscripcion.usuario")
        ->join("persona as p","p.id=user.persona")
        ->join("tipo_documento td","td.id=p.tipo_documento")
        ->where("curso.status","ACTIVO")
        ->where("p.status","ACTIVO")
        ->where("user.deleted_at is null")
        ->where("p.deleted_at is null")
        ->where("curso.deleted_at is null")
        ->orderBy("inscripcion.id","ASC");
  
      if($paginate){
          $answer = $answer->countAllResults();
      }else{
          $answer = $answer->findAll();
      }
      return $answer;
    }
    public function getCursos(object $infoTable, bool $paginate = false){
      $answer=$this->select("
          curso.nombre,
          curso.id,
          curso.descripcion
      ")->join("curso","curso.id=inscripcion.curso")
        ->join("usuario as user","user.id=inscripcion.usuario")
        ->join("persona as p","p.id=user.persona")
        ->where("curso.status","ACTIVO")
        ->where("p.status","ACTIVO")
        ->where("user.deleted_at is null")
        ->where("p.deleted_at is null")
        ->where("curso.deleted_at is null")
        ->where("p.id",$infoTable->idPersona)
        ->orderBy("curso.nombre","ASC");
  
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
    public function findMatricula(object $data){
      $answer=$this->where('usuario',$data->usuario)
                   ->where('curso',$data->curso)
                  ->first();
      return $answer;
    }
}
?>
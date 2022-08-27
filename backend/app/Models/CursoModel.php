<?php
namespace App\Models;
use CodeIgniter\Model;
class CursoModel extends Model
{
    protected $table      = 'curso';
    protected $primaryKey = 'id';
    protected $allowedFields = [
                                'id',
                                'nombre',
                                'descripcion',
                                'status',
                                'created_by', 
                                'updated_by', 
                                'deleted_by' 
                              ];
    protected $returnType = 'array';
    protected $useSoftDeletes = true;
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';
    /**
    * 1. Descripción: obtiene el rol dado de acuerdo a los parametros dados en el array
    * 2. Vista web: Ninguna
    * 3. Api: Ninguna
    */
   public function getCourses(object $infoTable, bool $paginate = false){
    $answer=$this->select("
        curso.id,
        curso.nombre,
        p.nombre as programa,
        p.id as idPrograma,
        cp.id as idCursoPrograma,
        curso.descripcion,
        curso.status
    ")->join("curso_programa as cp","curso.id=cp.curso")
      ->join("programa as p","cp.programa=p.id")
      ->where("curso.status","ACTIVO")
      ->where("p.status","ACTIVO")
      ->where("cp.deleted_at is null")
      ->where("p.deleted_at is null")
      ->orderBy("curso.id","ASC");

    if($paginate){
        $answer = $answer->countAllResults();
    }else{
        $answer = $answer->findAll();
    }
    return $answer;
  }
  public function guardar(object $infoTable){
    $answer=$this->insert($infoTable);
    return $answer;
  }
  public function actualizar(object $infoTable){
    $id=$infoTable->id;
    unset($infoTable->id);
    unset($infoTable->token);
    $answer=$this->update($id,$infoTable);
    return $answer;
  }
  public function eliminar(object $infoTable){
    $infoTable->status="INACTIVO";
    $id=$infoTable->id;
    unset($infoTable->id);
    $answer=$this->update($id,$infoTable);
    $answer=$this->delete($id);
    return $answer;
  }
  
  public function findCurso(object $infoTable){
    $answer=$this->select("
          curso.id,
          curso.nombre,
          curso.status")
          ->where("curso.nombre",$infoTable->nombre);
    $answer = $answer->first();
    return $answer;
  }
  public function findCursos(object $infoTable, bool $paginate = false){
    $answer=$this->select("
          curso.id,
          curso.nombre");
          if($paginate){
            $answer = $answer->countAllResults();
        }else{
            $answer = $answer->findAll();
        }
    return $answer;
  }

}
?>
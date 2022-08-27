<?php
namespace App\Models;
use CodeIgniter\Model;
class ProgramasModel extends Model
{
    protected $table      = 'programa';
    protected $primaryKey = 'id';
    protected $allowedFields = [
                                'id',
                                'nombre',
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
   public function getPrograms(object $infoTable, bool $paginate = false){
    $answer=$this->select("
        programa.id,
        programa.nombre,
        programa.status
    ");

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
  public function findPrograma(object $infoTable){
    $answer=$this->select("
      programa.id,
      programa.nombre,
      programa.status")
      ->where("programa.nombre",$infoTable->nombre);
    $answer = $answer->first();
    return $answer;
  }
}
?>
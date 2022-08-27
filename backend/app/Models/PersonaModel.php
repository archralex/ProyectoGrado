<?php
namespace App\Models;
use CodeIgniter\Model;
class PersonaModel extends Model
{
    protected $table      = 'persona';
    protected $primaryKey = 'id';
    protected $allowedFields = [
                                'id',
                                'tipo_documento',
                                'identificacion',
                                'programa',
                                'nombres',
                                'apellidos',
                                'foto',
                                'celular',
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
    * 1. Descripción: obtiene los estudiantes
    * 2. Vista web: admin/estudiantes
    */
   public function getStudents(object $infoTable, bool $paginate = false){
    $answer=$this->select("
        persona.id,
        persona.tipo_documento,
        persona.identificacion,
        persona.nombres,
        persona.apellidos,
        persona.celular,
        td.codigo as tipoId,
        td.id as idTipo,
        p.nombre as nombrePrograma,
        p.id as programa,
        user.status
    ");
    $answer=$answer->join("usuario AS user","user.persona=persona.id")
                   ->join("tipo_documento td","td.id=persona.tipo_documento")
                   ->join("programa p","p.id=persona.programa")
                   ->join("rol","rol.id=user.rol")
                   ->where("rol.nombre","ESTUDIANTE")
                   ->where("user.status","ACTIVO")
                   ->where("rol.status","ACTIVO");
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
        unset($infoTable->token);
        $answer=$this->update($id,$infoTable);
        $answer=$this->delete($id);
        return $answer;
    }
    public function findPersona(object $infoTable){
        $answer=$this->select("
              persona.id,
              persona.nombres,
              persona.status")
              ->where("persona.identificacion",$infoTable->identificacion);
        if(isset($infoTable->tipo_documento)){
            $answer=$answer->where("persona.tipo_documento",$infoTable->tipo_documento);
        }
        $answer = $answer->first();
        return $answer;
      }
}
?>
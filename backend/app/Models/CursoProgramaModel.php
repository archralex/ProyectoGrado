<?php
namespace App\Models;
use CodeIgniter\Model;
class CursoProgramaModel extends Model
{
    protected $table      = 'curso_programa';
    protected $primaryKey = 'id';
    protected $allowedFields = [
                                'id',
                                'curso',
                                'programa',
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
    public function findAsociacion(object $data){
      $answer=$this->where('programa',$data->programa)
                   ->where('curso',$data->curso)
                  ->first();
      return $answer;
    }
}
?>
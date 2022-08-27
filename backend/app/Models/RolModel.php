<?php
namespace App\Models;
use CodeIgniter\Model;
class RolModel extends Model
{
    protected $table      = 'rol';
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
   public function getRol(array $parametro){
    return $this->where($parametro)
                ->first();
  }
}
?>
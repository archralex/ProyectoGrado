<?php
namespace App\Models;
use CodeIgniter\Model;
class UsuarioModel extends Model
{
    protected $table      = 'usuario';
    protected $primaryKey = 'id';
    protected $allowedFields = [
                                'id',
                                'rol',
                                'persona',
                                'username',
                                'password',
                                'correo',
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
    * 1. Descripción: Obtiene la sesión de un usuario, la data depende del canal
    * 2. Vista web: login
    * 3. API: login
    */
    public function obtenerSession($data){

      $rol=$this->select('rol.nombre')
                ->join('rol','rol.id=usuario.rol')
                ->where('usuario.username', $data)
                ->where('rol.status','ACTIVO')
                ->first();
      if(!$rol){
        return false;
      }
      $respuesta=$this->select("usuario.id as idUsuario,
                                usuario.password,
                                usuario.username,
                                usuario.correo,
                                usuario.status,
                                p.id as idPersona,
                                p.nombres,
                                p.apellidos,
                                p.identificacion,
                                p.foto,
                                td.codigo as tipoIdentificacion,
                                r.nombre as nombreRol,
                                r.id as idRol")
                      ->join('persona p','p.id=usuario.persona')
                      ->join('tipo_documento td','td.id=p.tipo_documento')
                      ->join('rol r','r.id=usuario.rol')
                      ->where('username',$data);

      $respuesta=$respuesta->where('usuario.status','ACTIVO')
                           ->where('r.status','ACTIVO')
                           ->first();
      return $respuesta;
    } 

    /** 
     * 1. Descripción: Obtiene la lista de usuarios
     * 2. Vista web: gestionUsuarios/usuarios,
     * 3. API: 
    */                     
    public function getUsuarios(object $infoTable,bool $op=false){
      $respuesta=$this->select('usuario.id,
                                usuario.correo,                      
                                usuario.status,
                                usuario.rol, 
                                usuario.username,
                                p.tipo_documento,
                                p.identificacion,
                                p.id as persona,
                                CONCAT(p.nombres," ",p.apellidos) as nombre'
                              )
                      ->join('persona p','usuario.persona=p.id')
                      ->join('rol ro','usuario.rol=ro.id')
                      ->where('usuario.deleted_at is null')
                      ->where('ro.nombre','ESTUDIANTE')
                      ->where('p.deleted_at is null')
                      ->where('usuario.status','ACTIVO')
                      ->Where('p.status','ACTIVO');
        $respuesta=$respuesta->orderBy('usuario.id','ASC');
      //SECCION DE EJECUCION DE CONSULTA
      if($op){
        $respuesta=$respuesta->countAllResults();
      }else{
          $respuesta=$respuesta->findAll();
      }
      return $respuesta;
      
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
    
    public function findUsuario(object $infoTable){
      $answer=$this->select("
            usuario.id,
            usuario.persona,
            usuario.username,
            usuario.password,
            usuario.correo,
            usuario.rol,
            usuario.status")
            ->where("usuario.username",$infoTable->username)
            ->where("usuario.status","ACTIVO");
      $answer = $answer->first();
      return $answer;
    }
    public function findUsuarioByIdentificacion(object $infoTable){
      $answer=$this->select("
            usuario.id,
            usuario.persona,
            usuario.username,
            usuario.password,
            usuario.correo,
            usuario.rol,
            usuario.status")
            ->join('persona p','p.id=usuario.persona')
            ->where("p.identificacion",$infoTable->identificacion)
            ->where("usuario.status","ACTIVO");
      $answer = $answer->first();
      return $answer;
    }

}
?>
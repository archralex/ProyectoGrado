<?php
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Models\{
    IpsModel,
    TipoIdentificacionModel,
    EstadoCivilModel,
    EpsModel,
    PersonaModel,
    TipoAfiliadoModel,
    DepartamentoModel,
    EscolaridadModel,
    DiscapacidadModel,
    ReligionModel,
    ParentescoModel,
    AislamientoModel,
    MunicipiosModel,
    IdiomaModel,
    InformacionGeneralModel,
};
function nombreValido($nombre){
    $nombre=trim($nombre);
    $expresion="/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/";
    if (preg_match($expresion, $nombre)) {
        return true;
    }else{
        return false;
    }
}
function identificacionValida($Identificacion){
        $Identificacion=trim($Identificacion);
        if(!is_numeric($Identificacion)){
            return false;
        }
        if(!ctype_digit($Identificacion)){
          return false;
        }
        return true;
}
function correoValido($email){
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
      if (filter_var($email, FILTER_VALIDATE_EMAIL)===false){
          return false;
      }
    return true;
}


function sexo($se){
      if ($se === 'FEMENINO' || $se === 'MASCULINO' || $se === 'INDETERMINADO'){
          return true;
      }
    return false;
}

function fechaNacimiento($fecha){
    $valores = explode('-', $fecha);

    $hoy = date('Y-m-d');

    if($fecha <= $hoy){
        if(count($valores) == 3 && checkdate($valores[1], $valores[2], $valores[0])){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

function telefonoValido($telefono){
    if(!is_numeric($telefono)){
        return false;
      }
    if(!ctype_digit($telefono)){
    return false;
    }
    return true;
}

/** 
 * 1. Descripción: Función que permite agregar un archivo a una ruta especificada.
*/
function agregarArchivo(array $config){
    $hay_archivo = $_FILES[$config['varName']]['name']!=""?true:false;
    $respuesta=null;
    $ruta=null;
		/*Verifico si hay un archivo y lo guardo en el storage*/
		if($hay_archivo){

			$folio = $config['folio']; /*Nombre Carpeta*/
			$URL_DOCUMENT = getenv('app.uploadFiles');/*Esto hay que agregarlo en el .env*/
			$URL_DOCUMENT =$URL_DOCUMENT.'/';
            $path = $URL_DOCUMENT.$folio.'/'; /*Armo la ruta junto con la carpeta*/
			$fecha = date("YmdHis");
			if (file_exists($path)) {
				/*Miro si el path existe, y guarno el documento*/
                $fueMovido = move_uploaded_file($_FILES[$config['varName']]['tmp_name'],$path.$fecha.$_FILES[$config['varName']]['name']);
				if ($fueMovido){
					$ruta = $folio.'/'.$fecha.$_FILES[$config['varName']]['name'];
				}
			} else {
				/*Miro si el path existe, en caso tal no, lo creo*/
				mkdir($path, 0777, true);
				if (move_uploaded_file($_FILES[$config['varName']]['tmp_name'],$path.$fecha.$_FILES[$config['varName']]['name'])){
					$ruta = $folio.'/'.date("YmdHis").$_FILES[$config['varName']]['name'];
				} 
			}
            $respuesta = [
                'ruta' => $ruta,
                'nombre' => $_FILES[$config['varName']]['name'],
                'tipo' => $_FILES[$config['varName']]['type'],
                'tamano' => $_FILES[$config['varName']]['size'],
            ];
		}
    return $respuesta;
}
/** 
 * 1. Descripción: Función que permite pasar una imagen a base64
*/
function toBase64(array $config){
    $type=$_FILES[$config['varName']]['type'];
    return "data:$type;base64,".base64_encode(file_get_contents($_FILES[$config['varName']]['tmp_name']));
}

/** 
 * 1. Descripción: Función que permite saber si hay un archivo.
*/
function haveFile(array $config){
    $respuesta = null;
    $hay_archivo = (isset($_FILES[$config['varName']]['name']) and $_FILES[$config['varName']]['name']!="")?true:false;
    return $hay_archivo;
}
/** 
 * 1. Descripción: Función que permite obtener las reglas que debe cumplir la carga de una imagen.
*/
function getRuleImage(array $config)
{
    return[
        'label' => 'Image File',
        'rules' => 'uploaded['.$config['inputName'].']'
            . '|is_image['.$config['inputName'].']'
            . '|mime_in['.$config['inputName'].',image/jpg,image/jpeg,image/gif,image/png,image/webp]'
            . '|max_size['.$config['inputName'].','.$config["max_size"].']'
            . '|max_dims['.$config['inputName'].','.$config["max_width"].','.$config["max_height"].']'
    ];
}
/** 
 * 1. Descripción: Función que permite obtener la lista de mensajes de error para una carga de imagen.
*/
function getMessageErrorsImage()
{
    return[
            'mime_in'   => 'no es un tipo de imagen válido.',
            'max_size'  => 'tiene un tamaño no válido.',
            'max_dims' => 'no tiene las dimensiones correctas.',
            'is_image' => 'no es una imagen.'
    ];
}
function agregarArchivoZip(array $config){
    $hay_archivo = $_FILES[$config['varName']]['name']!=""?true:false;
    $respuesta=null;
    $ruta=null;
    /*Verifico si hay un archivo y lo guardo en el storage*/
    if($hay_archivo){
        $folio = $config['folio']; /*Nombre Carpeta*/
        $URL_DOCUMENT = getenv('app.uploadFiles');/*Esto hay que agregarlo en el .env*/
        $URL_DOCUMENT =$URL_DOCUMENT.'/';
        $path = $URL_DOCUMENT.$folio.'/'; /*Armo la ruta junto con la carpeta*/
        $fecha = date("YmdHis");
        $nombreArchivo= $_FILES[$config['varName']]['name'];
        $nombreCarpeta = substr($nombreArchivo,0,strlen($nombreArchivo)-4);
        $path = $path.$fecha.$nombreCarpeta;
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }
        //mover el archivo
        $fueMovido = move_uploaded_file($_FILES[$config['varName']]['tmp_name'],$path.'/'.$nombreArchivo);
        if ($fueMovido){
            $ruta = $folio.'/'.$fecha.$nombreCarpeta;
            //descomprimo el archivo
            $zip = new ZipArchive;
            $res = $zip->open($path.'/'.$nombreArchivo);
            if ($res === TRUE) {
                $zip->extractTo($path);
                $zip->close();
                unlink($path.'/'.$nombreArchivo);
                $respuesta = [
                    'ruta' => $ruta,
                    'nombre' => $_FILES[$config['varName']]['name'],
                    'tipo' => $_FILES[$config['varName']]['type'],
                    'tamano' => $_FILES[$config['varName']]['size'],
                ];
            } 
        }
    }
    return $respuesta;
}
function eliminarDirectorio(string $dir){
    $respuesta = null;
    if (file_exists($dir)) {
        if ($dh = opendir($dir)) {
            while (($file = readdir ($dh)) != false) {
                if ($file == "." || $file == "..") {
                    continue;
                }
                if (is_dir($dir . '/' . $file)) {
                    eliminarDirectorio($dir . '/' . $file);
                } else {
                    unlink($dir . '/' . $file);
                }
            }
            closedir($dh);
            rmdir($dir);
        }
        $respuesta = true;
    }
    return $respuesta;
}
/** 
 * 1. Descripción: Función que permite poner nulos aquellos campos que se encuentran vacios o que representan un nulo, ejemplo '','0','<p><br></p>'.
 * 2. Parametros: $data: array con los datos a validar.
 * 3. Retorno: array con los datos nulos y no nulos, nulos aquellos datos que deban serlo.
*/
function setNull(array $inputs){
    $inputs = array_map(function($value){
        if($value=="" or $value=="0"or $value=="<p><br></p>"or $value=="null" or$value=="undefined"){
            return null;
        }else{
            return $value;
        }
    },$inputs);
    return $inputs;
}  
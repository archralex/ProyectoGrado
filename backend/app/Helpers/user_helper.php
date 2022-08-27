<?php

function hashPassword($plainPassword){
    return password_hash($plainPassword, PASSWORD_DEFAULT);
}

function verifyPassword($plainPassword, $hashPassword){
    return password_verify ($plainPassword, $hashPassword);
}

function hashPassword512($plainPassword){
    return hash('sha512', $plainPassword);
}

function verifyPassword512($plainPassword, $hashPassword){
    return ($hashPassword==hashPassword512($plainPassword));
}
function contraValida($contra){
    if(strlen($contra)<8){
        $respuesta=["La contraseña debe contener mínimo 8 carácteres",false];
        return $respuesta;
    }
    if (!preg_match('`[a-z]`',$contra)){
        $respuesta=["La contraseña debe contener al menos una letra minúscula",false];
        return $respuesta;
    }
    if (!preg_match('`[A-Z]`',$contra)){
        $respuesta=["La contraseña debe contener al menos una letra mayúscula",false];
        return $respuesta;
    }
    if (!preg_match('`[0-9]`',$contra)){
        $respuesta=["La contraseña debe contener al menos un número",false];
        return $respuesta;
    }
    $respuesta=["contraseña válida",true];
    return $respuesta;
}
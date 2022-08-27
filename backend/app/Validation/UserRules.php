<?php
namespace App\Validation;
use App\Models\UsuarioModel;
use Exception;

class UserRules
{
    public function validateUser(string $str, string $fields, array $data): bool
    {
        try {
            $userModel = new UsuarioModel();
            $user = $userModel->obtenerSession($data['username']);
            $res=verifyPassword512($data['password'], $user['password']);
            return $res;
        } catch (Exception $e) {
            return false;
        }
    }
}
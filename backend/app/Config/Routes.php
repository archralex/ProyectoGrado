<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (file_exists(SYSTEMPATH . 'Config/Routes.php')) {
    require SYSTEMPATH . 'Config/Routes.php';
}

/*
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(true);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
$routes->get('/', 'Home::index');
$routes->post('login','LoginController::login',['namespace' => 'App\Controllers\API']);
$routes->get('renew','ExpireTokenController::index',['namespace' => 'App\Controllers\API']);
/*=======================================================================
								RUTAS CON TOKEN
=========================================================================*/
$routes->group('api',['namespace' => 'App\Controllers\API','filter'=>'ApiFilter'], function($routes){
    $routes->group('estudiantes', function($routes){
        $routes->post('listar'  , 'EstudiantesController::mostrar');
        $routes->post('guardar' , 'EstudiantesController::guardar');
        $routes->post('editar'  , 'EstudiantesController::editar');
        $routes->post('eliminar', 'EstudiantesController::eliminar');
        $routes->post('correoFoto/editar'  , 'EstudiantesController::actualizarCorreoFoto');
    });
    $routes->group('usuarios'  , function($routes){
        $routes->post('listar'  , 'UsuarioController::mostrar');
        $routes->post('guardar' , 'UsuarioController::guardar');
        $routes->post('editar'  , 'UsuarioController::editar');
        $routes->post('eliminar', 'UsuarioController::eliminar');
    });
    $routes->group('cursos', function($routes){
        $routes->post('listar'             , 'CursosController::mostrar');
        $routes->post('guardar'            , 'CursosController::guardar');
        $routes->post('editar'             , 'CursosController::editar');
        $routes->post('eliminar'           , 'CursosController::eliminar');
        $routes->post('asociacion/guardar' , 'CursosController::guardarAsociacion');
        $routes->post('asociacion/editar'  , 'CursosController::editarAsociacion');
        $routes->post('asociacion/eliminar', 'CursosController::eliminarAsociacion');
        $routes->post('obtener/cursos'     , 'CursosController::cursos');
    });
    $routes->group('programas'  , function($routes){
        $routes->post('listar'  , 'ProgramasController::mostrar');
        $routes->post('guardar' , 'ProgramasController::guardar');
        $routes->post('editar'  , 'ProgramasController::editar');
        $routes->post('eliminar', 'ProgramasController::eliminar');
    });
    $routes->group('matriculas'  , function($routes){
        $routes->post('listar'  , 'InscripcionController::mostrar');
        $routes->post('guardar' , 'InscripcionController::guardar');
        $routes->post('editar'  , 'InscripcionController::editar');
        $routes->post('eliminar', 'InscripcionController::eliminar');
        $routes->post('cursos/listar', 'InscripcionController::getCursos');
    });
    $routes->group('contenidos'  , function($routes){
        $routes->post('listar'  , 'ContenidosController::mostrar');
        $routes->post('guardar' , 'ContenidosController::guardar');
        $routes->post('editar'  , 'ContenidosController::editar');
        $routes->post('eliminar', 'ContenidosController::eliminar');
        $routes->post('temas/listar'  , 'ContenidosController::getContenidosPorCurso');
    });
});









/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */
if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
    require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}

<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\CLIRequest;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use CodeIgniter\Validation\Exceptions\ValidationException;
use Config\Services;
/**
 * Class BaseController
 *
 * BaseController provides a convenient place for loading components
 * and performing functions that are needed by all your controllers.
 * Extend this class in any new controllers:
 *     class Home extends BaseController
 *
 * For security be sure to declare any new methods as protected or private.
 */
class BaseController extends Controller
{
    /**
     * Instance of the main Request object.
     *
     * @var CLIRequest|IncomingRequest
     */
    protected $request;

    /**
     * An array of helpers to be loaded automatically upon
     * class instantiation. These helpers will be available
     * to all other controllers that extend BaseController.
     *
     * @var array
     */
    protected $helpers = ['user','persona','jwt'];

    /**
     * Constructor.
     */
    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        // Do Not Edit This Line
        parent::initController($request, $response, $logger);

        // Preload any models, libraries, etc, here.

        // E.g.: $this->session = \Config\Services::session();
    }
    /** 
	 * Los controladores utilizarán esta función para devolver respuestas JSON
	*/
	public function getResponse(array $responseBody, int $code = ResponseInterface::HTTP_OK){
		return $this->response
					->setStatusCode($code)
					->setJSON(json_encode($responseBody));
	}
	/**
	 * Captura el request y lo convierte en un vector o matriz asociativa
	 * y anexa el canal donde fue ejecutado el request
	 */
	public function getRequestInput(IncomingRequest $request){
		$input = $request->getPost();
		if (empty($input)) {
			//convertir el cuerpo de la solicitud en una matriz asociativa
			$input = json_decode($request->getBody(), true);
		}
		return $input;
	}
	/**
	 * Valida las reglas definidas por el desarrollador para una entrada
	 */
	public function validateRequest($input, array $rules, array $messages =[]){
		$this->validator = Services::Validation()->setRules($rules);
		// Si reemplaza la matriz $ rules con el nombre del grupo
		if (is_string($rules)) {
			$validation = config('Validation');
	
			/* Si la regla no se encuentra en el \Config\Validation, se debe 
				lanzar una excepción para que el desarrollador pueda encontrarla. */
			if (!isset($validation->$rules)) {
				throw ValidationException::forRuleNotFound($rules);
			}
	
			/* Si no se define ningún mensaje de error, utilice el mensaje de error 
			en el archivo Config\Validation*/
			if (!$messages) {
				$errorName = $rules . '_errors';
				$messages = $validation->$errorName ?? [];
			}
	
			$rules = $validation->$rules;
		}
		$res=$this->validator->setRules($rules, $messages)->run($input);
		return $res;
	}
}

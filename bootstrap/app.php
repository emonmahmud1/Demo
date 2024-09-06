<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpFoundation\Response;
use App\Main\API\Response as CustomizedResponse;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (Response $response) {
            if ($response->getStatusCode() === 405) {
                return CustomizedResponse::withNotFoundMethod("The method request is not supported");
            }
            if ($response->getStatusCode() === 404) {
                return CustomizedResponse::withNotFound("Not found");
            }
            if ($response->getStatusCode() === 401) {
                return CustomizedResponse::withUnauthorized("The user is not authorized");
            }
            // if ($response->getStatusCode() === 500) {
            //     return CustomizedResponse::withInternalServerError("An internal server error has occured");
            // }

            return $response;
        });
    })->create();

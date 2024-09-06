<?php

namespace App\Main\API;

/**
* @param string $message
* @param $data
* @return JsonResponse
 */

class Response{
    public static function withOk(String $message,$data=null){
        return response()->json([
            'status'=>'Success',
            'message'=>$message,
            'data'=>$data
        ]);
    }

    public static function withCreated(String $message,$data=null){
        return response()->json([
            'status'=>'Created',
            'message'=>$message,
            'data'=>$data
        ]);
    }

    public static function withNoContent(String $message,$data=null){
        return response()->json([
            'status'=>'No Content',
            'message'=>$message,
            'data'=>$data
        ]);
    }

    public static function withBadRequest(String $message,$data=null){
        return response()->json([
            'status'=>'Bad Request',
            'message'=>$message,
            'data'=>$data
        ]);
    }

    public static function withUnauthorized(String $message,$data=null){
        return response()->json([
            'status'=>'Unauthorized',
            'message'=>$message,
            'data'=>$data
        ]);
    }

    public static function withForbidden(String $message,$data=null){
        return response()->json([
            'status'=>'Forbidden',
            'message'=>$message,
            'data'=>$data
        ]);
    }

    public static function withNotFound(String $message,$data=null){
        return response()->json([
            'status'=>'Not Found',
            'message'=>$message,
            'data'=>$data
        ]);
    }

    public static function withNotFoundMethod(String $message,$data=null){
        return response()->json([
            'status'=>'Method Not Allowed',
            'message'=>$message,
            'data'=>$data
        ]);
    }

    public static function withInternalServerError(String $message,$data=null){
        return response()->json([
            'status'=>'Internal Server Error',
            'message'=>$message,
            'data'=>$data
        ]);
    }
}
<?php

namespace App\Main;

use App\Mail\SendMail;
use App\Main\API\Response;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailServices
{
    public static function SendEmail(array $data)
    {
        try {
            Mail::to($data['to_list'])->send(new SendMail($data));

            return Response::withOk("Email sent sucessfully");
        } catch (Exception $e) {
            return Response::withBadRequest("Unable to send email");
        }
    }
}

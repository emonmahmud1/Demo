<?php

namespace App\Http\Controllers\v1;

use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Permissions;
use App\Main\Tracelogs;
use App\Models\SMTP;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SMTPController extends Controller
{
    private static function report(array $queries = [])
    {
        $s_m_t_p_s = DB::table('s_m_t_p_s')
            ->select('s_m_t_p_s.*')
            ->whereNull('deleted_at');

        if (isset($queries['id'])) {
            $s_m_t_p_s = $s_m_t_p_s->where('id', $queries['id']);
        }
        if (isset($queries['list'])) {
            $s_m_t_p_s = $s_m_t_p_s->get();
        } else {
            $s_m_t_p_s = $s_m_t_p_s->first();
        }
        return $s_m_t_p_s;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['s_m_t_p']['read'] . ' s_m_t_p');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $smtps = self::report(array_merge([], ['list' => true]));
        if (count($smtps) > 0) {
            return Response::withOk("All the smtps" . Message::$fetchSuccess, $smtps);
        }
        return Response::withNotFound("All the smtps" . Message::$fetchFailed, $smtps);
   
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['s_m_t_p']['create'] . ' s_m_t_p');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'mail_mailer' => ['required', 'string'],
            'mail_host' => ['required', 'string'],
            'mail_port'=>['required', 'string', 'max:4'],
            'mail_username'=>['required', 'string'],
            'mail_password'=>['required', 'string'],
            'mail_encryption'=>['required', 'string'],
            'mail_from_address'=>['required', 'string'],
            'mail_from_name'=>['required', 'string'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("SMTP" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        $smtpId = DB::table('s_m_t_p_s')->insertGetId([
            'mail_mailer'=>$validatedData['mail_mailer'],
            'mail_host'=>$validatedData['mail_host'],
            'mail_port'=>$validatedData['mail_port'],
            'mail_username'=>$validatedData['mail_username'],
            'mail_password'=>$validatedData['mail_password'],
            'mail_encryption'=>$validatedData['mail_encryption'],
            'mail_from_address'=>$validatedData['mail_from_address'],
            'mail_from_name'=>$validatedData['mail_from_name'],
            'created_at' => now(),
        ]);
        Tracelogs::AddTraceLogs(
            's_m_t_p',
            'new',
            's_m_t_p_s',
            $smtpId,
            null,
            null,
        );
        $smtp = self::report(array_merge(['id' => $smtpId]));
        return Response::withCreated("SMTP" . Message::$createSuccess, $smtp);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['s_m_t_p']['read'] . ' s_m_t_p');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("SMTP id" . Message::$invalid);
        }
        $smtp = self::report(array_merge(['id' => $id]));
        if ($smtp) {
            return Response::withOk("SMTP" . Message::$fetchSuccess, $smtp);
        }
        return Response::withNotFound("SMTP" . Message::$fetchFailed, $smtp);
   
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['s_m_t_p']['update'] . ' s_m_t_p');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'id'=>['required','integer','exists:s_m_t_p_s,id'],
            'mail_mailer' => ['required', 'string'],
            'mail_host' => ['required', 'string'],
            'mail_port'=>['required', 'string', 'max:4'],
            'mail_username'=>['required', 'string'],
            'mail_password'=>['required', 'string'],
            'mail_encryption'=>['required', 'string'],
            'mail_from_address'=>['required', 'string'],
            'mail_from_name'=>['required', 'string'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("SMTP" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        Tracelogs::AddTraceLogs(
            's_m_t_p',
            'update',
            's_m_t_p_s',
            $validatedData['id'],
            SMTP::find($validatedData['id']),
            null,
        );
        $smtp = DB::table('s_m_t_p_s')->where('id', $validatedData['id'])->whereNull('deleted_at')->update([
            'mail_mailer'=>$validatedData['mail_mailer'],
            'mail_host'=>$validatedData['mail_host'],
            'mail_port'=>$validatedData['mail_port'],
            'mail_username'=>$validatedData['mail_username'],
            'mail_password'=>$validatedData['mail_password'],
            'mail_encryption'=>$validatedData['mail_encryption'],
            'mail_from_address'=>$validatedData['mail_from_address'],
            'mail_from_name'=>$validatedData['mail_from_name'],
            'updated_at' => now()
        ]);
        if ($smtp) {
            return Response::withCreated("SMTP" . Message::$updateSuccess, $validatedData);
        }

        return Response::withBadRequest("SMTP" . Message::$updateFailed);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['s_m_t_p']['delete'] . ' s_m_t_p');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("SMTP id" . Message::$invalid);
        }
        $status = DB::table('s_m_t_p_s')->where('id', $id)->whereNull('deleted_at')->update(['deleted_at' => now()]);
        if($status){
            return Response::withOk("SMTP" . Message::$delSuccess, $status);
        }
        return Response::withBadRequest("SMTP" . Message::$delFailed);
    }
    /**
     * Restore the specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['s_m_t_p']['restore'] . ' s_m_t_p');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("SMTP id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'dealer',
            'restore',
            'dealers',
            $id,
            null,
            null,
        );

        $status = DB::table('s_m_t_p_s')->where('id', $id)->whereNotNull('deleted_at')->update(['deleted_at' => Null]);
        if ($status) {
            return Response::withOk("SMTP" . Message::$restoreSuccess);
        }
        return Response::withBadRequest("SMTP" . Message::$restoreFailed);
    }
}

<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Permissions;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

class SessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        if (!$user) {
            return Response::withBadRequest("User" . Message::$notAuthorized, $user);
        }
        // $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['session']['read'] . ' session');
        // if (!$checkPerm) {
        //     return Response::withForbidden("User" . Message::$forbidden);
        // }
        $sessions = DB::table('personal_access_tokens')->where('tokenable_id', $user->id)->get();

        $cleanSessions = $sessions->map(function ($sessions) {
            unset($sessions->token);
            return $sessions;
        });
        if ($cleanSessions) {
            return Response::withOk("Sessions" . Message::$fetchSuccess, $cleanSessions);
        }
        return Response::withNotFound("Sessions" . Message::$notFound);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['session']['read'] . ' session');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("User" . Message::$notFound);
        }
        $sessions = DB::table('personal_access_tokens')->where('tokenable_id', $id)->get();

        $cleanSessions = $sessions->map(function ($sessions) {
            unset($sessions->token);
            return $sessions;
        });
        if ($cleanSessions) {
            return Response::withOk("Sessions" . Message::$fetchSuccess, $cleanSessions);
        }
        return Response::withNotFound("Sessions" . Message::$notFound);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['session']['delete'] . ' session');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if ($id === null || !is_numeric($id)) {
            return Response::withBadRequest("Session" . Message::$invalid);
        }
        $session = DB::table('personal_access_tokens')->where('tokenable_id', Auth::id())->latest()->first();
        if ($session && $session->id == $id) {
            return Response::withForbidden("Current session id" . Message::$forbidden);
        }
        $status=DB::table('personal_access_tokens')->where('id', $id)->delete();
        if($status){
            return Response::withOk("Session" . Message::$delSuccess,$status);
        }
        return Response::withBadRequest("Session" . Message::$delFailed);
    }
}

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
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['permission']['read'] . ' permission');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $permissions = DB::table('permissions')->get();
        if (count($permissions) > 0) {
            return Response::withOk("All the permissions" . Message::$fetchSuccess, $permissions);
        }
        return Response::withNotFound("All the permissions" . Message::$fetchFailed, $permissions);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['permission']['read'] . ' permission');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id == null) {
            return Response::withBadRequest("The permission id" . Message::$invalid);
        }

        $perm = DB::table('permissions')->where('id', $id)->first();
        if ($perm) {
            return Response::withOk("The permission id" . Message::$fetchSuccess, $perm);
        }
        return Response::withNotFound("The permission id" . Message::$notFound);
    }

    public function assignToUser(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['permission']['assign-user'] . ' permission');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'permissions_list' => ['required', 'array'],
            'permissions_list.*' => ['required', 'integer', 'exists:permissions,id']
        ]);
        $validatedData = $validationState->validated();

        if ($validationState->fails()) {
            return Response::withBadRequest("Input data" . Message::$validationFailed, $validationState->errors());
        }
        if($validatedData['user_id']===Auth::id()){
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $user = User::find($validatedData['user_id']);
        $user->syncPermissions($validatedData['permissions_list']);

        return Response::withOk('Permission and user assignment' . Message::$createSuccess);
    }


    public function assignToRole(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['permission']['assign'] . ' permission');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'role_id' => ['required', 'integer', 'exists:roles,id'],
            'permissions_list' => ['required', 'array'],
            'permissions_list.*' => ['required', 'integer', 'exists:permissions,id']
        ]);
        $validatedData = $validationState->validated();

        if ($validationState->fails()) {
            return Response::withBadRequest("Input data" . Message::$validationFailed, $validationState->errors());
        }
        $role = Role::find($validatedData['role_id']);
        $role->syncPermissions($validatedData['permissions_list']);

        return Response::withOk('Permission and role assignment' . Message::$createSuccess);
    }
}

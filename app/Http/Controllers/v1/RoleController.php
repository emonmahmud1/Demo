<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Events;
use App\Main\Permissions;
use App\Main\Tracelogs;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['role']['read'] . ' role');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $roles = DB::table('roles')->get();

        return Response::withOk("All the roles" . Message::$fetchSuccess, $roles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['role']['create'] . ' role');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:50', 'unique:roles,name'],
        ]);
        if ($validationState->fails()) {
            return Response::withBadRequest("Role" . Message::$validationFailed, $validationState->errors());
        }
        $validatedData = $validationState->validated();

        $roleId= DB::table('roles')->insertGetId([
            'name' => $validatedData['name'],
            'guard_name' => 'web',
            'created_at'=>now()
        ]);

        Tracelogs::AddTraceLogs(
            'role',
            'new',
            'roles',
            $roleId,
            null,
            null,
        );
        $role = DB::table('roles')->where('id', $roleId)->first();

        if ($role) {
            return Response::withCreated("Role" . Message::$createSuccess, $role);
        }
        return Response::withBadRequest("Role" . Message::$createFailed);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['role']['read'] . ' role');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id == null) {
            return Response::withBadRequest("The role id" . Message::$invalid);
        }

        $perm = DB::table('roles')->where('id', $id)->first();
        if ($perm) {
            return Response::withOk("The role id" . Message::$fetchSuccess, $perm);
        }
        return Response::withNotFound("The role id" . Message::$notFound);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['role']['update'] . ' role');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'id' => ['required', 'integer', 'exists:roles,id'],
            'name' => ['required', 'string', 'max:50', 'unique:roles,name,' . $request->id],
        ]);
        $validatedData = $validationState->validated();

        Tracelogs::AddTraceLogs(
            'role',
            'update',
            'roles',
            $validatedData['id'],
            Role::find($validatedData['id']),
            null,
        );
        if ($validationState->fails()) {
            return Response::withBadRequest("Role" . Message::$validationFailed, $validationState->errors());
        }
        $roleDetails = DB::table('roles')->where('id', $validatedData['id'])->update([
            'name' => $validatedData['name'],
            'updated_at' => now(),
        ]);
        $role = DB::table('roles')->where('id', $request->id)->first();
        if ($roleDetails) {
            return Response::withOk("Role" . Message::$updateSuccess, $role);
        }
        return Response::withBadRequest("Role" . Message::$updateFailed, $validatedData);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['role']['delete'] . ' role');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id == null) {
            return Response::withBadRequest("The role id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'role',
            'delete',
            'roles',
            $id,
            Role::find($id),
            null,
        );
        $role = DB::table('roles')->where('id', $id)->where('protected',false)->get();
        if (count($role) > 0) {
            $val = DB::table('roles')->where('id', $id)->where('protected',false)->delete();
            return Response::withOk("Role id" . Message::$delSuccess, $val);
        }
        return Response::withBadRequest("Role id" . Message::$delFailed);
    }

    public function assignToUser(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['role']['assign'] . ' role');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'roles_list' => ['required', 'array'],
            'roles_list.*' => ['required', 'integer', 'exists:roles,id']
        ]);
        $validatedData = $validationState->validated();

        if ($validationState->fails()) {
            return Response::withBadRequest("Input data" . Message::$validationFailed, $validationState->errors());
        }
        if($validatedData['user_id']===Auth::id()){
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $user = User::find($validatedData['user_id']);
        $user->syncRoles($validatedData['roles_list']);

        return Response::withOk('Roles assigned successfully.');
    }
}

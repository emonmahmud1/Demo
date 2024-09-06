<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Events;
use App\Main\Permissions;
use App\Models\User;
use App\Main\Report\User as UserReport;
use App\Main\Tracelogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['user']['read'] . ' user');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $users = UserReport::all([],$deleted=false);

        return Response::withOk("All the users" . Message::$fetchSuccess, $users);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['user']['read'] . ' user');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id == null) {
            return Response::withBadRequest("The user id" . Message::$invalid);
        }
        $checkUser=UserReport::checkUser(['id'=>$id],$deleted=false);

        if(!$checkUser){
            return Response::withNotFound("The user id" . Message::$notFound);
        }
        $user=UserReport::getWithRolesPerms($id);

        if ($user) {
            return Response::withOk("The user id" . Message::$fetchSuccess, $user);
        }
        return Response::withNotFound("The user id" . Message::$notFound);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['user']['update'] . ' user');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'id' => ['required', 'integer'],
            'employee_id' => ['required', 'string', 'unique:users,employee_id,'.$request->input('id')],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'name' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:50', 'unique:users,email,'.$request->input('id')],
            'phone_number' => ['required', 'string', 'max:11'],
            'date_of_birth' => ['date'],
            'gender' => ['required', 'string'],
            'address' => [ 'string', 'max:150'],
            'roles_list' => ['required', 'array'],
            'roles_list.*' => ['required', 'integer', 'exists:roles,id']
        ]);
        $validatedData = $validationState->validated();

        Tracelogs::AddTraceLogs(
            'user',
            'update',
            'users',
           $validatedData['id'],
            User::find($validatedData['id']),
            null,
        );

        if ($validationState->fails()) {
            return Response::withBadRequest("User" . Message::$validationFailed, $validationState->errors());
        }

        $userDetails = DB::table('users')->where('id', $validatedData['id'])->update([
            'department_id'=>$validatedData['department_id'],
            'employee_id'=>$validatedData['employee_id'],
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'phone_number' => $validatedData['phone_number'],
            'date_of_birth' => $validatedData['date_of_birth'],
            'gender' => $validatedData['gender'],
            'address' => $validatedData['address'],
            'updated_at' => now(),
        ]);

        if ($userDetails) {
            User::find($validatedData['id'])->syncRoles($validatedData['roles_list']);
            return Response::withOk("User" . Message::$updateSuccess, $validatedData);
        }
        return Response::withBadRequest("User" . Message::$updateFailed, $userDetails);
    }

    public function updatePassword()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['user']['update'] . ' user');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make(request()->all(), [
            'current_password' => ['required', 'string','min:8', function ($attribute, $value, $fail) {
                if (!Hash::check($value, Auth::user()->password)) {
                    $fail('The current password does not match.');
                }
            }],
            'password' => ['required', 'string','confirmed','min:8', Rules\Password::defaults()],
        ]);
        $validatedData = $validationState->validated();

        if ($validationState->fails()) {
            return Response::withBadRequest("User" . Message::$validationFailed, $validationState->errors());
        }
        Tracelogs::AddTraceLogs(
            'user',
            'update',
            'users',
            Auth::id(),
            User::find(Auth::id()),
            null,
        );
        $userDetails = DB::table('users')->where('id', Auth::id())->update([
            'password' => Hash::make($validatedData['password']),
            'updated_at' => now(),
        ]);

        if ($userDetails) {
            return Response::withOk("User password" . Message::$updateSuccess);
        }
        return Response::withBadRequest("User password" . Message::$updateFailed);
    }

    public function resetPassword()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['user']['update'] . ' user');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make(request()->all(), [
            'password' => ['required', 'string','min:8', 'confirmed', Rules\Password::defaults()],
        ]);
        $validatedData = $validationState->validated();

        if ($validationState->fails()) {
            return Response::withBadRequest("User" . Message::$validationFailed, $validationState->errors());
        }
        Tracelogs::AddTraceLogs(
            'user',
            'update',
            'users',
            Auth::id(),
            User::find(Auth::id()),
            null,
        );
        $userDetails = DB::table('users')->where('id', Auth::id())->update([
            'password' => Hash::make($validatedData['password']),
            'updated_at' => now(),
        ]);

        if ($userDetails) {
            return Response::withOk("User password" . Message::$updateSuccess);
        }
        return Response::withBadRequest("User password" . Message::$updateFailed);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['user']['delete'] . ' user');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id == null) {
            return Response::withBadRequest("The user id" . Message::$invalid);
        }
        if ($id == Auth::id()) {
            return Response::withForbidden("User will be logged out forcefully");
        }
        $user = UserReport::checkUser(['id'=>$id],$deleted=false);

        Tracelogs::AddTraceLogs(
            'user',
            'delete',
            'users',
            $id,
            User::find($id),
            null,
        );
        if ($user) {
            DB::table('users')->whereNull('deleted_at')->where('id', $id)->update(['deleted_at' => now()]);
            return Response::withOk("User id" . Message::$delSuccess);
        }
        return Response::withNotFound("User id" . Message::$notFound);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['user']['restore'] . ' user');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id == null) {
            return Response::withBadRequest("The user id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'user',
            'update',
            'users',
            $id,
            User::find($id),
            null,
        );
        $user = UserReport::checkUser(['id'=>$id],$deleted=true);
        if ($user) {
            DB::table('users')->whereNotNull('deleted_at')->where('id', $id)->update(['deleted_at' => Null]);
            return Response::withOk("User id" . Message::$restoreSuccess);
        }
        return Response::withNotFound("User id" . Message::$notFound);
    }

    /**
     * Display the listing of the deleted resource.
     */
    public function getDeletedUsers(){
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['user']['read'] . ' user');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $users = UserReport::all([],$deleted=true);

        return Response::withOk("All the users" . Message::$fetchSuccess, $users);
    }
}

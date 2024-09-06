<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Events;
use App\Main\Permissions;
use App\Main\Tracelogs;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    private static function report(array $queries = [])
    {
        $depts = DB::table('departments')
            ->select('departments.*')
            ->whereNull('deleted_at');
        if(isset($queries['id'])){
            $depts=$depts->where('id', $queries['id']);
        }
        if(isset($queries['list'])){
            $depts=$depts->get();
        }
        else{
            $depts=$depts->first();
        }
        return $depts;

    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['department']['read'] . ' department');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $depts = self::report(array_merge([], ['list' => true]));
        foreach ($depts as $dept){
            $dept->to_list = json_decode($dept->to_list);
            $dept->cc = json_decode($dept->cc);
            $dept->bcc = json_decode($dept->bcc);
        }
        return Response::withOk("All the departments" . Message::$fetchSuccess, $depts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['department']['create'] . ' department');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:50', 'unique:departments,name'],
            'to_list' => ['nullable','array'],
            'cc' => ['nullable','array'],
            'bcc' => ['nullable', 'array'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Department" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        $deptId = DB::table('departments')->insertGetId([
            'name' => $validatedData['name'],
            'to_list' => json_encode($validatedData['to_list']),
            'cc' => json_encode($validatedData['cc']),
            'bcc' => json_encode($validatedData['bcc']),
            'created_at' => now(),
        ]);
        Tracelogs::AddTraceLogs(
            'department',
            'new',
            'departments',
            $deptId,
            null,
            null,
        );
        
        $dept = DB::table('departments')->where('id',$deptId)->whereNull('deleted_at')->first();
        if ($dept) {
            $dept->to_list = json_decode($dept->to_list);
            $dept->cc = json_decode($dept->cc);
            $dept->bcc = json_decode($dept->bcc);
            
        }
        return Response::withCreated("Department" . Message::$createSuccess, $dept);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['department']['read'] . ' department');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Department id" . Message::$invalid);
        }
        $dept = self::report(array_merge(['id' => $id]));
        if ($dept) {
            return Response::withOk("Department" . Message::$fetchSuccess, $dept);
        }
        return Response::withNotFound("Department" . Message::$fetchFailed, $dept);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['department']['update'] . ' department');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'id' => ['required', 'integer', 'exists:departments,id'],
            'name' => ['required', 'string', 'max:50', 'unique:departments,name'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Department" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();
        Tracelogs::AddTraceLogs(
            'department',
            'update',
            'departments',
            $validatedData['id'],
            Department::find($validatedData['id']),
            null,
        );
        $dept = DB::table('departments')->where('id', $validatedData['id'])->whereNull('deleted_at')->update([
            'name' => $validatedData['name'],
            'updated_at' => now()
        ]);
        if ($dept) {
            return Response::withCreated("Department" . Message::$updateSuccess, $validatedData);
        }

        return Response::withBadRequest("Department" . Message::$updateFailed, $dept);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['department']['delete'] . ' department');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Department id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'department',
            'delete',
            'departments',
            $id,
            Department::find($id),
            null,
        );
        $status = DB::table('departments')->where('id', $id)->whereNull('deleted_at')->update(['deleted_at' => now()]);
        if($status){
            return Response::withOk("Department" . Message::$delSuccess, $status);    
        }
        return Response::withBadRequest("Department" . Message::$delFailed);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['department']['restore'] . ' department');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Department id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'department',
            'restore',
            'departments',
            $id,
            null,
            null,
        );
        $status = DB::table('departments')->where('id', $id)->whereNotNull('deleted_at')->update(['deleted_at' => Null]);
        if($status){
            return Response::withOk("Department" . Message::$restoreSuccess, $status);            
        }
        return Response::withBadRequest("Department" . Message::$restoreFailed);
    }
}

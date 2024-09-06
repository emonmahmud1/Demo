<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Events;
use App\Main\Permissions;
use App\Main\Tracelogs;
use App\Models\CallType;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CallTypeController extends Controller
{
    private static function report(array $queries = [])
    {
        $calls = DB::table('call_types')
            ->select('call_types.*')
            ->whereNull('deleted_at');
        if (isset($queries['id'])) {
            $calls = $calls->where('id', $queries['id']);
        }
        if (isset($queries['list'])) {
            $calls = $calls->get();
        } else {
            $calls = $calls->first();
        }
        return $calls;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_type']['read'] . ' call_type');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $calls = self::report(array_merge([], ['list' => true]));

        return Response::withOk("Call types" . Message::$fetchSuccess, $calls);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_type']['create'] . ' call_type');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:50', 'unique:call_types,name'],
            'name_bn' => ['required', 'string', 'max:50', 'unique:call_types,name_bn']
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Call type" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        $callId = DB::table('call_types')->insertGetId([
            'name' => $validatedData['name'],
            'name_bn' => $validatedData['name_bn'],
            'created_at' => now(),
        ]);

        Tracelogs::AddTraceLogs(
            'call_type',
            'new',
            'call_types',
            $callId,
            null,
            null,
        );
        $calls = self::report(array_merge(['id' => $callId]));
        return Response::withCreated("Call type" . Message::$createSuccess, $calls);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_type']['read'] . ' call_type');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Call type id" . Message::$invalid);
        }
        $call_types = self::report(array_merge(['id' => $id]));
        if ($call_types) {
            return Response::withOk("Call type" . Message::$fetchSuccess, $call_types);
        }
        return Response::withNotFound("Call type" . Message::$fetchFailed, $call_types);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_type']['update'] . ' call_type');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'id' => ['required', 'integer', 'exists:call_types,id'],
            'name' => ['required', 'string', 'max:50', 'unique:call_types,name'],
            'name_bn' => ['required', 'string', 'max:50', 'unique:call_types,name_bn']
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Call type" . Message::$validationFailed, $validationState->errors());
        }


        $validatedData = $validationState->validated();
        Tracelogs::AddTraceLogs(
            'call_type',
            'update',
            'call_types',
            $validatedData['id'],
            CallType::find($validatedData['id']),
            null,
        );
        $calls = DB::table('call_types')->where('id', $validatedData['id'])->update([
            'name' => $validatedData['name'],
            'name_bn' => $validatedData['name_bn'],
            'updated_at' => now(),
        ]);
        if ($calls) {

            return Response::withCreated("Call type" . Message::$updateSuccess, $validatedData);
        }

        return Response::withBadRequest("Call type" . Message::$updateFailed, $validatedData);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_type']['delete'] . ' call_type');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Call type id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'call_type',
            'delete',
            'call_types',
            $id,
            CallType::find($id),
            null,
        );
        $status = DB::table('call_types')->where('id', $id)->whereNull('deleted_at')->update(['deleted_at' => now()]);
        if ($status) {
            return Response::withOk("Call type" . Message::$delSuccess, $status);
        }
        return Response::withBadRequest("Call type" . Message::$delFailed);
    }

    /**
     * Restore the removed specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_type']['restore'] . ' call_type');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Call type id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'call_type',
            'restore',
            'call_types',
            $id,
            null,
            null,
        );
        $status = DB::table('call_types')->where('id', $id)->whereNotNull('deleted_at')->update(['deleted_at' => Null]);
        if ($status) {
            return Response::withOk("Call type" . Message::$restoreSuccess, $status);
        }
        return Response::withBadRequest("Call type" . Message::$restoreFailed);
    }

    /**
     * Change status of the specified resource from storage.
     */
    public function changeStatus(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_type']['status'] . ' call_type');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Call type id" . Message::$invalid);
        }
        $call_types = DB::table('call_types')->where('id', $id)->whereNotNull('deleted_at')->first();
        if ($call_types) {
            return Response::withBadRequest("Call type" . Message::$delFailed);
        }
        $checkCallType = DB::table('call_types')->where('id', $id)->first();
        if (!$checkCallType) {
            return Response::withNotFound("Call type" . Message::$notFound, $checkCallType);
        }
        Tracelogs::AddTraceLogs(
            'call_type',
            'status',
            'call_types',
            $id,
            CallType::find($id),
            null,
        );
        $stat = ($checkCallType->status == 'active') ? 'inactive' : 'active';
        DB::table('call_types')
            ->where('id', $id)
            ->update(['status' => $stat]);
        return Response::withOk("Call type status" . Message::$updateSuccess);
    }
}

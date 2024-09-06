<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Events;
use App\Main\Permissions;
use App\Main\Tracelogs;
use App\Models\District;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DistrictController extends Controller
{
    private static function report(array $queries = [])
    {
        $districts = DB::table('districts')
            ->select('districts.*')
            ->whereNull('deleted_at');
        if (isset($queries['id'])) {
            $districts = $districts->where('id', $queries['id']);
        }
        if (isset($queries['list'])) {
            $districts = $districts->get();
        } else {
            $districts = $districts->first();
        }
        return $districts;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['district']['read'] . ' district');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $districts = self::report(array_merge([], ['list' => true]));

        return Response::withOk("All the districts" . Message::$fetchSuccess, $districts);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['district']['create'] . ' district');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:50', 'unique:districts,name'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("District" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        $districtId = DB::table('districts')->insertGetId([
            'name' => $validatedData['name'],
            'created_at' => now(),
        ]);
        Tracelogs::AddTraceLogs(
            'district',
            'new',
            'districts',
            $districtId,
            null,
            null,
        );
        $district = self::report(array_merge(['id' => $districtId]));

        return Response::withCreated("District" . Message::$createSuccess, $district);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['district']['read'] . ' district');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("District id" . Message::$invalid);
        }
        $district = self::report(array_merge(['id' => $id]));
        if ($district) {
            return Response::withOk("District" . Message::$fetchSuccess, $district);
        }
        return Response::withNotFound("District" . Message::$fetchFailed, $district);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['district']['update'] . ' district');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'id' => ['required', 'integer', 'exists:districts,id'],
            'name' => ['required', 'string', 'max:50', 'unique:districts,name'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("District" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        Tracelogs::AddTraceLogs(
            'district',
            'update',
            'districts',
            $validatedData['id'],
            District::find($validatedData['id']),
            null,
        );
        $district = DB::table('districts')->where('id', $validatedData['id'])->update([
            'name' => $validatedData['name'],
            'updated_at' => now()
        ]);
        if ($district) {

            return Response::withCreated("District" . Message::$updateSuccess, $validatedData);
        }

        return Response::withBadRequest("District" . Message::$updateFailed, $validatedData);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['district']['delete'] . ' district');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("District id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'district',
            'delete',
            'districts',
            $id,
            District::find($id),
            null,
        );
        $status = DB::table('districts')->where('id', $id)->whereNull('deleted_at')->update(['deleted_at' => now()]);
        if ($status) {
            return Response::withOk("District" . Message::$delSuccess, $status);
        }
        return Response::withBadRequest("District" . Message::$delFailed);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['district']['restore'] . ' district');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("District id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'district',
            'restore',
            'districts',
            $id,
            null,
            null,
        );
        $status = DB::table('districts')->where('id', $id)->whereNotNull('deleted_at')->update(['deleted_at' => Null]);
        if ($status) {
            return Response::withOk("District" . Message::$restoreSuccess, $status);
        }
        return Response::withBadRequest("District" . Message::$restoreFailed);
    }
}

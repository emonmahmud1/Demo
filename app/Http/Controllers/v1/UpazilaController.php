<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Events;
use App\Main\Permissions;
use App\Main\Tracelogs;
use App\Models\Upazila;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UpazilaController extends Controller
{
    private static function report(array $queries = [])
    {
        $upazilas = DB::table('upazilas')
            ->leftJoin('districts', 'upazilas.district_id', '=', 'districts.id')
            ->select('upazilas.*', 'districts.name as district_name')
            ->whereNull('upazilas.deleted_at');
        if (isset($queries['id'])) {
            $upazilas = $upazilas->where('upazilas.id', $queries['id']);
        }
        if (isset($queries['district_id'])) {
            $upazilas = $upazilas->where('upazilas.district_id', $queries['district_id']);
        }
        if (isset($queries['list'])) {
            $upazilas = $upazilas->get();
        } else {
            $upazilas = $upazilas->first();
        }
        return $upazilas;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['upazila']['read'] . ' upazila');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validation = Validator::make(request()->all(), [
            'district_id' => ['nullable', 'integer', 'exists:upazilas,district_id']
        ]);
        $validatedData = $validation->validated();
        if ($validation->fails()) {
            return Response::withBadRequest("Validation failed", $validation->errors());
        }
        $upazilas = self::report(array_merge($validatedData, ['list' => true]));

        return Response::withOk("All the upazilas" . Message::$fetchSuccess, $upazilas);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['upazila']['create'] . ' upazila');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'district_id' => ['required', 'integer', 'exists:districts,id'],
            'name' => [
                'required', 'string', 'max:50',
                Rule::unique('upazilas')->where('upazilas.district_id', $request->input('district_id'))
            ],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Upazila" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        $upazilaId = DB::table('upazilas')->insertGetId([
            'district_id' => $validatedData['district_id'],
            'name' => $validatedData['name'],
            'created_at' => now(),
        ]);
        Tracelogs::AddTraceLogs(
            'upazila',
            'new',
            'upazilas',
            $upazilaId,
            null,
            null,
        );
        $upazila = self::report(array_merge(['id' => $upazilaId]));

        return Response::withCreated("Upazila" . Message::$createSuccess, $upazila);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['upazila']['read'] . ' upazila');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Upazila id" . Message::$invalid);
        }
        $upazila = self::report(array_merge(['id' => $id]));
        if ($upazila) {
            return Response::withOk("Upazila" . Message::$fetchSuccess, $upazila);
        }
        return Response::withNotFound("Upazila" . Message::$fetchFailed, $upazila);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['upazila']['update'] . ' upazila');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'district_id' => ['required', 'integer', 'exists:districts,id'],
            'id' => [
                'required',
                'integer',
                Rule::exists('upazilas', 'id')
                    ->where('district_id', request('district_id'))
            ],
            'name' => ['required', 'string', 'max:50', 'unique:upazilas,name'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Upazila" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();
        Tracelogs::AddTraceLogs(
            'upazila',
            'update',
            'upazilas',
            $validatedData['id'],
            Upazila::find($validatedData['id']),
            null,
        );
        $upazila = DB::table('upazilas')->where('id', $validatedData['id'])->update([
            'district_id' => $validatedData['upazila_id'],
            'name' => $validatedData['name'],
            'updated_at' => now()
        ]);
        if ($upazila) {

            return Response::withCreated("Upazila" . Message::$updateSuccess, $validatedData);
        }

        return Response::withBadRequest("Upazila" . Message::$updateFailed, $upazila);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['upazila']['delete'] . ' upazila');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Upazila id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'upazila',
            'delete',
            'upazilas',
            $id,
            Upazila::find($id),
            null,
        );
        $status = DB::table('upazilas')->where('id', $id)->whereNull('deleted_at')->update(['deleted_at' => now()]);
        if ($status) {
            return Response::withOk("Upazila" . Message::$delSuccess, $status);
        }
        return Response::withBadRequest("Upazila" . Message::$delFailed);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['upazila']['restore'] . ' upazila');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Upazila id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'upazila',
            'restore',
            'upazilas',
            $id,
            null,
            null,
        );
        $status = DB::table('upazilas')->where('id', $id)->whereNotNull('deleted_at')->update(['deleted_at' => Null]);
        if ($status) {
            return Response::withOk("Upazila" . Message::$restoreSuccess, $status);
        }
        return Response::withBadRequest("Upazila" . Message::$restoreFailed);
    }
}

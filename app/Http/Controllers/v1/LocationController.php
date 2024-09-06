<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Events;
use App\Main\Permissions;
use App\Main\Tracelogs;
use App\Models\Location;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class LocationController extends Controller
{
    private static function report(array $queries = [])
    {
        $locations = DB::table('locations')
            ->leftJoin('upazilas as cc', 'locations.upazila_id', '=', 'cc.id')
            ->leftJoin('districts', 'cc.district_id', '=', 'districts.id')
            ->select('locations.*', 'districts.name as district_name', 'cc.name as upazila_name')
            ->whereNull('locations.deleted_at');
            
        if (isset($queries['id'])) {
            $locations = $locations->where('locations.id', $queries['id']);
        }
        if (isset($queries['district_id'])) {
            $locations = $locations->where('locations.district_id', $queries['district_id']);
        }
        if (isset($queries['upazila_id'])) {
            $locations = $locations->where('locations.upazila_id', $queries['upazila_id']);
        }
        if (isset($queries['list'])) {
            $locations = $locations->get();
        } else {
            $locations = $locations->first();
        }
        return $locations;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::user()->id)->hasPermissionTo(Permissions::$permissions['location']['read'] . ' location');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validation = Validator::make(request()->all(), [
            'district_id' => [
                'nullable',
                'integer',
                Rule::exists('locations', 'district_id')
                    ->when(request('upazila_id'), function ($query) {
                        $query->where('upazila_id', request('upazila_id')->whereNull('deleted_at'));
                    })
            ],
            'upazila_id' => [
                'nullable',
                'integer',
                Rule::exists('locations', 'upazila_id')
                    ->when(request('district_id'), function ($query) {
                        $query->where('district_id', request('district_id')->whereNull('deleted_at'));
                    })
            ],
        ]);
        if ($validation->fails()) {
            return Response::withBadRequest("Validation failed", $validation->errors());
        }
        $locations = self::report(array_merge($validation->validated(), ['list' => true]));

        return Response::withOk("All the locations" . Message::$fetchSuccess, $locations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm = User::find(Auth::user()->id)->hasPermissionTo(Permissions::$permissions['location']['create'] . ' location');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'district_id' => ['required', 'integer', 'exists:districts,id'],
            'upazila_id' => [
                'required',
                'integer',
                Rule::exists('upazilas', 'id')
                    ->where('district_id', request('district_id'))
                    ->whereNull('deleted_at')
            ],
            'name' => ['required', 'string', 'max:150'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Location" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        $locationId = DB::table('locations')->insertGetId([
            'district_id' => $validatedData['district_id'],
            'upazila_id' => $validatedData['upazila_id'],
            'name' => $validatedData['name'],
            'created_at' => now(),
        ]);
        Tracelogs::AddTraceLogs(
            'location',
            'new',
            'locations',
            $locationId,
            null,
            null,
        );
        $location = self::report(array_merge(['id'=> $locationId]));
        return Response::withCreated("Location" . Message::$createSuccess, $location);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::user()->id)->hasPermissionTo(Permissions::$permissions['location']['read'] . ' location');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Location id" . Message::$invalid);
        }
        $location = self::report(array_merge(['id'=> $id]));
        if ($location) {
            return Response::withOk("Location" . Message::$fetchSuccess, $location);
        }
        return Response::withNotFound("Location" . Message::$fetchFailed, $location);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::user()->id)->hasPermissionTo(Permissions::$permissions['location']['update'] . ' location');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'district_id' => ['required', 'integer', 'exists:districts,id'],
            'upazila_id' => [
                'required',
                'integer',
                Rule::exists('upazilas', 'id')
                    ->where('district_id', request('district_id'))
                    ->whereNull('deleted_at')
            ],
            'id' => [
                'required',
                'integer',
                Rule::exists('locations', 'id')
                    ->where('district_id', request('district_id'))
                    ->where('upazila_id', request('upazila_id'))
                    ->whereNull('deleted_at')
            ],
            // 'id' => ['required', 'integer', 'exists:locations,id'],
            'name' => ['required', 'string', 'max:150'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Upazila" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();
        Tracelogs::AddTraceLogs(
            'location',
            'update',
            'locations',
            $validatedData['id'],
            Location::find($validatedData['id']),
            null,
        );
        $location = DB::table('locations')->where('id', $validatedData['id'])->update([
            'district_id' => $validatedData['district_id'],
            'upazila_id' => $validatedData['upazila_id'],
            'name' => $validatedData['name'],
            'updated_at' => now()
        ]);
        if ($location) {

            return Response::withCreated("Location" . Message::$updateSuccess, $validatedData);
        }

        return Response::withBadRequest("Location" . Message::$updateFailed, $validatedData);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::user()->id)->hasPermissionTo(Permissions::$permissions['location']['delete'] . ' location');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Location id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'location',
            'delete',
            'locations',
            $id,
            Location::find($id),
            null,
        );
        $status = DB::table('locations')->where('id', $id)->whereNull('deleted_at')->update(['deleted_at' => now()]);
        if($status){
            return Response::withOk("Location" . Message::$delSuccess, $status);
        }
        return Response::withBadRequest("Location" . Message::$delFailed);
    }


    /**
     * Restore the specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm = User::find(Auth::user()->id)->hasPermissionTo(Permissions::$permissions['location']['restore'] . ' location');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Location id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'location',
            'restore',
            'locations',
            $id,
            null,
            null,
        );
        $status = DB::table('locations')->where('id', $id)->whereNotNull('deleted_at')->update(['deleted_at' => Null]);
        if($status){
            return Response::withOk("Location" . Message::$restoreSuccess, $status);    
        }
        return Response::withBadRequest("Location" . Message::$restoreFailed);
    }
}

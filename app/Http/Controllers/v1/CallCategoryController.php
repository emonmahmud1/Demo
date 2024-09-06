<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Permissions;
use App\Main\Tracelogs;
use App\Models\CallCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CallCategoryController extends Controller
{
    private static function report(array $queries = [])
    {
        $call_categories = DB::table('call_categories')
            ->leftJoin('call_types', 'call_categories.call_type_id', '=', 'call_types.id')
            ->select('call_categories.*', 'call_types.name as call_type_name')
            ->whereNull('call_categories.deleted_at');
        if (isset($queries['id'])) {
            $call_categories = $call_categories->where('call_categories.id', $queries['id']);
        }
        if (isset($queries['call_type_id'])) {
            $call_categories = $call_categories->where('call_categories.call_type_id', $queries['call_type_id']);
        }
        if (isset($queries['list'])) {
            $call_categories = $call_categories->get();
        } else {
            $call_categories = $call_categories->first();
        }
        return $call_categories;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_category']['read'] . ' call_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validation = Validator::make(request()->all(), [
            'call_type_id' => ['nullable', 'integer', 'exists:call_categories,call_type_id']
        ]);
        if ($validation->fails()) {
            return Response::withBadRequest("Validation failed", $validation->errors());
        }

        $calls = self::report(array_merge($validation->validated(), ['list' => true]));
        return Response::withOk("Call types" . Message::$fetchSuccess, $calls);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_category']['create'] . ' call_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'call_type_id' => ['required', 'integer', 'exists:call_types,id'],
            'name' => [
                'required',
                'string',
                'max:250',
                Rule::unique('call_categories')->where('call_type_id', $request->input('call_type_id'))->whereNull('deleted_at')

            ],
            'name_bn' => [
                'required',
                'string',
                'max:250',
                Rule::unique('call_categories')->where('call_type_id', $request->input('call_type_id'))->whereNull('deleted_at')

            ],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Call category" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        $callId = DB::table('call_categories')->insertGetId([
            'call_type_id' => $validatedData['call_type_id'],
            'name' => $validatedData['name'],
            'name_bn' => $validatedData['name_bn'],
            'created_at' => now(),
        ]);
        Tracelogs::AddTraceLogs(
            'call_category',
            'new',
            'call_categories',
            $callId,
            null,
            null,
        );
        $calls = self::report(array_merge(['id' => $callId]));
        return Response::withCreated("Call " . Message::$createSuccess, $calls);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_category']['read'] . ' call_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Call category id" . Message::$invalid);
        }

        $call_categories = self::report(array_merge(['id' => $id]));
        if ($call_categories) {
            return Response::withOk("Call category" . Message::$fetchSuccess, $call_categories);
        }
        return Response::withNotFound("Call category" . Message::$fetchFailed, $call_categories);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_category']['update'] . ' call_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'call_type_id' => ['required', 'integer', 'exists:call_types,id'],
            'id' => [
                'required',
                'integer',

                Rule::exists('call_categories', 'id')
                    ->whereNull('deleted_at')
            ],
            'name' => ['required', 'string', 'max:250'],
            'name_bn' => ['required', 'string', 'max:250']
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Call category" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();
        Tracelogs::AddTraceLogs(
            'call_category',
            'update',
            'call_categories',
            $validatedData['id'],
            CallCategory::find($validatedData['id']),
            null,
        );
        $calls = DB::table('call_categories')->where('id', $validatedData['id'])->update([
            'call_type_id'=>$validatedData['call_type_id'],
            'name' => $validatedData['name'],
            'name_bn' => $validatedData['name_bn'],
            'updated_at' => now()
        ]);
        if ($calls) {

            return Response::withCreated("Call category" . Message::$updateSuccess, $validatedData);
        }

        return Response::withBadRequest("Call category" . Message::$updateFailed, $validatedData);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_category']['delete'] . ' call_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Call category id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'call_category',
            'delete',
            'call_categories',
            $id,
            CallCategory::find($id),
            null,
        );
        $status = DB::table('call_categories')->where('id', $id)->whereNull('deleted_at')->update(['deleted_at' => now()]);
        if($status){
            return Response::withOk("Call category" . Message::$delSuccess, $status);
        }
        return Response::withBadRequest("Call category" . Message::$delFailed);
    }

    /**
     * Restore the removed specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_category']['restore'] . ' call_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Call category id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'call_category',
            'restore',
            'call_categories',
            $id,
            null,
            null,
        );
        $status = DB::table('call_categories')->where('id', $id)->whereNotNull('deleted_at')->update(['deleted_at' => Null]);
        if($status){
            return Response::withOk("Call category" . Message::$restoreSuccess, $status);
        }
        return Response::withBadRequest("Call category" . Message::$restoreFailed);
    }

    /**
     * Change status of the specified resource from storage.
     */
    public function changeStatus(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_category']['status'] . ' call_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Call category id" . Message::$invalid);
        }

        $call_categories = DB::table('call_categories')->where('id', $id)->whereNotNull('deleted_at')->first();
        if ($call_categories) {
            return Response::withBadRequest("Call category" . Message::$delFailed);
        }
        $checkCall = DB::table('call_categories')->where('id', $id)->first();
        if (!$checkCall) {
            return Response::withNotFound("Call category" . Message::$notFound, $checkCall);
        }
        Tracelogs::AddTraceLogs(
            'call_category',
            'status',
            'call_categories',
            $id,
            CallCategory::find($id),
            null,
        );
        $stat = ($checkCall->status == 'active') ? 'inactive' : 'active';
        DB::table('call_categories')
            ->where('id', $id)
            ->whereNull('deleted_at')
            ->update(['status' => $stat]);
        return Response::withOk("Call category status" . Message::$updateSuccess);
    }
}

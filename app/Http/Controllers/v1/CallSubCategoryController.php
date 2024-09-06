<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Permissions;
use App\Main\Tracelogs;
use App\Models\CallSubCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CallSubCategoryController extends Controller
{
    private static function report(array $queries = [])
    {
        $call_sub_categories = DB::table('call_sub_categories')
            ->leftJoin('call_categories as cc', 'call_sub_categories.call_category_id', '=', 'cc.id')
            ->leftJoin('call_types', 'cc.call_type_id', '=', 'call_types.id')
            ->leftJoin('departments', 'call_sub_categories.department_id', '=', 'departments.id')
            ->leftJoin('s_m_t_p_s','call_sub_categories.s_m_t_p_id','=','s_m_t_p_s.id')
            ->select('call_sub_categories.*', 'call_types.name as call_type_name', 'cc.name as call_category_name')
            ->whereNull('call_sub_categories.deleted_at');

        if (isset($queries['id'])) {
            $call_sub_categories = $call_sub_categories->where('call_sub_categories.id', $queries['id']);
        }
        if (isset($queries['department_id'])) {
            $call_sub_categories = $call_sub_categories->where('call_sub_categories.department_id', $queries['department_id']);
        }
        if (isset($queries['call_type_id'])) {
            $call_sub_categories = $call_sub_categories->where('call_sub_categories.call_type_id', $queries['call_type_id']);
        }
        if (isset($queries['call_category_id'])) {
            $call_sub_categories = $call_sub_categories->where('call_sub_categories.call_category_id', $queries['call_category_id']);
        }
        if (isset($queries['s_m_t_p_id'])) {
            $call_sub_categories = $call_sub_categories->where('call_sub_categories.s_m_t_p_id', $queries['s_m_t_p_id']);
        }
        if (isset($queries['list'])) {
            $call_sub_categories = $call_sub_categories->get();
        } else {
            $call_sub_categories = $call_sub_categories->first();
        }
        return $call_sub_categories;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_sub_category']['read'] . ' call_sub_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validation = Validator::make(request()->all(), [
            'call_type_id' => [
                'integer',
                Rule::exists('call_sub_categories', 'call_type_id')
                    ->when(request('call_category_id'), function ($query) {
                        $query->where('call_category_id', request('call_category_id'));
                    })
            ],
            'call_category_id' => [
                'integer',
                Rule::exists('call_sub_categories', 'call_category_id')
                    ->when(request('call_type_id'), function ($query) {
                        $query->where('call_type_id', request('call_type_id'));
                    })
            ],
            'department_id' => ['integer', Rule::exists('call_sub_categories', 'department_id')
                ->when(request('call_type_id'), function ($query) {
                    $query->where('call_type_id', request('call_type_id'));
                    $query->where('call_category_id', request('call_category_id'));

                })
                ->when(request('call_category_id'), function ($query) {
                    $query->where('call_type_id', request('call_type_id'));
                    $query->where('call_category_id', request('call_category_id'));

                })],
            's_m_t_p_id'=>['integer','exists:s_m_t_p_s,id']
        ]);
        if ($validation->fails()) {
            return Response::withBadRequest("Validation failed", $validation->errors());
        }

        $calls =  self::report(array_merge($validation->validated(), ['list' => true]));
        foreach ($calls as $call){
            $call->to_list = json_decode($call->to_list);
            $call->cc = json_decode($call->cc);
            $call->bcc = json_decode($call->bcc);
        }

        return Response::withOk("Call sub categories" . Message::$fetchSuccess, $calls);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_sub_category']['create'] . ' call_sub_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'call_type_id' => ['required', 'integer', 'exists:call_types,id'],
            'call_category_id' => [
                'required',
                'integer',
                Rule::exists('call_categories', 'id')
                    ->where('call_type_id', request('call_type_id'))
            ],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            's_m_t_p_id'=>['required','integer','exists:s_m_t_p_s,id'],
            'name' => [
                'required',
                'string',
                'max:250',
                Rule::unique('call_sub_categories')->where('call_category_id', $request->input('call_category_id'))->whereNull('deleted_at')

            ],
            'name_bn' => [
                'required',
                'string',
                'max:250',
                Rule::unique('call_sub_categories')->where('call_category_id', $request->input('call_category_id'))->whereNull('deleted_at')

            ],
            'to_list' => ['array'],
            'cc' => ['array'],
            'bcc' => [ 'array'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Call sub category" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        $callId = DB::table('call_sub_categories')->insertGetId([
            'call_type_id' => $validatedData['call_type_id'],
            'call_category_id' => $validatedData['call_category_id'],
            'department_id' => $validatedData['department_id'],
            's_m_t_p_id' => $validatedData['s_m_t_p_id'],
            'name' => $validatedData['name'],
            'name_bn' => $validatedData['name_bn'],
            'to_list' => json_encode($validatedData['to_list']),
            'cc' => json_encode($validatedData['cc']),
            'bcc' => json_encode($validatedData['bcc']),
            'created_at' => now(),
        ]);
        Tracelogs::AddTraceLogs(
            'call_sub_category',
            'new',
            'call_sub_categories',
            $callId,
            null,
            null,
        );
        $depts=DB::table('departments')->where('id',$validatedData['department_id'])->whereNull('deleted_at')->first();
        $calls = DB::table('call_sub_categories')->where('id',$callId)->whereNull('deleted_at')->first();
        if ($calls) {
            $calls->to_list = array_merge(json_decode($calls->to_list),json_decode($depts->to_list)??[]);
            $calls->cc = array_merge(json_decode($calls->cc),json_decode($depts->cc)??[]);
            $calls->bcc = array_merge(json_decode($calls->bcc),json_decode($depts->bcc)??[]);
        }
        return Response::withCreated("Call sub category" . Message::$createSuccess, $calls);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_sub_category']['read'] . ' call_sub_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Call sub category id" . Message::$invalid);
        }
        $call_subcategories = self::report(array_merge(['id' => $id]));
        if ($call_subcategories) {
            return Response::withOk("Call sub category" . Message::$fetchSuccess, $call_subcategories);
        }
        return Response::withNotFound("Call sub category" . Message::$fetchFailed, $call_subcategories);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_sub_category']['update'] . ' call_sub_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'call_type_id' => ['required', 'integer', 'exists:call_types,id'],
            'call_category_id' => [
                'required',
                'integer',
                Rule::exists('call_categories', 'id')
                    ->where('call_type_id', request('call_type_id'))
                    ->whereNull('deleted_at')
            ],
            'department_id' => [
                'required', 'integer',
                Rule::exists('call_sub_categories', 'department_id')
                    ->where('id', request('id'))
                    ->whereNull('deleted_at')
            ],
            's_m_t_p_id'=>['required','integer','exists:s_m_t_p_s,id'],
            'id' => [
                'required',
                'integer',
                Rule::exists('call_sub_categories', 'id')
                    ->whereNull('deleted_at')
            ],

            'name' => ['required', 'string', 'max:250'],
            'name_bn' => ['required', 'string', 'max:250'],
            'to_list' => ['nullable','array'],
            'cc' => ['nullable','array'],
            'bcc' => ['nullable', 'array'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Call sub category" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();
        Tracelogs::AddTraceLogs(
            'call_sub_category',
            'update',
            'call_sub_categories',
            $validatedData['id'],
            CallSubCategory::find($validatedData['id']),
            null,
        );
        $calls = DB::table('call_sub_categories')->where('id', $validatedData['id'])->update([
            'call_type_id' => $validatedData['call_type_id'],
            'call_category_id' => $validatedData['call_category_id'],
            'department_id' => $validatedData['department_id'],
            's_m_t_p_id' => $validatedData['s_m_t_p_id'],
            'name' => $validatedData['name'],
            'name_bn' => $validatedData['name_bn'],
            'to_list' => json_encode($validatedData['to_list']),
            'cc' => json_encode($validatedData['cc']),
            'bcc' => json_encode($validatedData['bcc']),
            'updated_at' => now()
        ]);
        $validatedData['to_list']= json_decode(json_encode($validatedData['to_list']));
        $validatedData['cc'] = json_decode(json_encode($validatedData['cc']));
        $validatedData['bcc'] = json_decode(json_encode($validatedData['bcc']));
        if ($calls) {
            return Response::withCreated("Call sub category" . Message::$updateSuccess, $validatedData);
        }
        return Response::withBadRequest("Call sub category" . Message::$updateFailed, $validatedData);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_sub_category']['delete'] . ' call_sub_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Call sub category id" . Message::$invalid);
        }
        $status = DB::table('call_sub_categories')->where('id', $id)->whereNull('deleted_at')->update(['deleted_at' => now()]);
        if($status){
            return Response::withOk("Call sub category" . Message::$delSuccess, $status);
        }
        return Response::withBadRequest("Call sub category" . Message::$delFailed);
    }

    /**
     * Restore the removed specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_sub_category']['restore'] . ' call_sub_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Call sub category id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'call_sub_category',
            'restore',
            'call_sub_categories',
            $id,
            null,
            null,
        );
        $status = DB::table('call_sub_categories')->where('id', $id)->whereNotNull('deleted_at')->update(['deleted_at' => Null]);
        if($status){
            return Response::withOk("Call sub category" . Message::$restoreSuccess, $status);
        }
        return Response::withBadRequest("Call sub category" . Message::$restoreFailed);
    }

    /**
     * Change status of the specified resource from storage.
     */
    public function changeStatus(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['call_sub_category']['status'] . ' call_sub_category');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Call sub category id" . Message::$invalid);
        }
        $call_categories = DB::table('call_sub_categories')->where('id', $id)->whereNotNull('deleted_at')->first();
        if ($call_categories) {
            return Response::withBadRequest("Call sub category" . Message::$delFailed);
        }
        $checkCall = DB::table('call_sub_categories')->where('id', $id)->first();
        if (!$checkCall) {
            return Response::withNotFound("Call sub category" . Message::$notFound, $checkCall);
        }
        Tracelogs::AddTraceLogs(
            'call_sub_category',
            'status',
            'call_sub_categories',
            $id,
            CallSubCategory::find($id),
            null,
        );
        $stat = ($checkCall->status == 'active') ? 'inactive' : 'active';
        DB::table('call_sub_categories')
            ->where('id', $id)
            ->update(['status' => $stat]);
        return Response::withOk("Call sub category status" . Message::$updateSuccess);
    }
}

<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Events;
use App\Main\Permissions;
use App\Main\Tracelogs;
use App\Models\ProductModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProductModelController extends Controller
{
    private static function report(array $queries = [])
    {
        $product_models = DB::table('product_models')
            ->leftJoin('products', 'product_models.product_id', '=', 'products.id')
            ->select('product_models.*', 'products.name as product_name')
            ->whereNull('product_models.deleted_at');
        if (isset($queries['id'])) {
            $product_models = $product_models->where('product_models.id', $queries['id']);
        }
        if (isset($queries['product_id'])) {
            $product_models = $product_models->where('product_models.product_id', $queries['product_id']);
        }
        if (isset($queries['list'])) {
            $product_models = $product_models->get();
        } else {
            $product_models = $product_models->first();
        }
        return $product_models;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product_model']['read'] . ' product_model');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validation = Validator::make(request()->all(), [
            'product_id' => ['nullable', 'integer', 'exists:product_models,product_id'],
        ]);
        if ($validation->fails()) {
            return Response::withBadRequest("Validation failed", $validation->errors());
        }
        $product_models = self::report(array_merge($validation->validated(), ['list' => true]));

        return Response::withOk("All the product models" . Message::$fetchSuccess, $product_models);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product_model']['create'] . ' product_model');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'name' => ['required', 'string', 'max:50'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Product model" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        $product_model_id = DB::table('product_models')->insertGetId([
            'product_id' => $validatedData['product_id'],
            'name' => $validatedData['name'],
            'created_at' => now(),
        ]);
        Tracelogs::AddTraceLogs(
            'product_model',
            'new',
            'product_models',
            $product_model_id,
            null,
            null,
        );
        $product_model = self::report(array_merge(['id' => $product_model_id]));

        return Response::withCreated("Product model" . Message::$createSuccess, $product_model);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product_model']['read'] . ' product_model');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Product model id" . Message::$invalid);
        }
        $product_model = self::report(array_merge(['id' => $id]));
        if ($product_model) {
            return Response::withOk("Product model" . Message::$fetchSuccess, $product_model);
        }
        return Response::withNotFound("Product model" . Message::$fetchFailed, $product_model);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product_model']['update'] . ' product_model');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'id' => [
                'required',
                'integer',
                Rule::exists('product_models', 'id')
                    ->whereNull('deleted_at')
            ],
            'name' => ['required', 'string', 'max:50'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Product model" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        Tracelogs::AddTraceLogs(
            'product_model',
            'update',
            'product_models',
            $validatedData['id'],
            ProductModel::find($validatedData['id']),
            null,
        );
        $product_model = DB::table('product_models')->where('id', $validatedData['id'])->update([
            'product_id' => $validatedData['product_id'],
            'name' => $validatedData['name'],
            'updated_at' => now()
        ]);
        if ($product_model) {

            return Response::withCreated("Product model" . Message::$updateSuccess, $validatedData);
        }

        return Response::withBadRequest("Product model" . Message::$updateFailed, $validatedData);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product_model']['delete'] . ' product_model');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Product model id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'product_model',
            'delete',
            'product_models',
            $id,
            ProductModel::find($id),
            null,
        );
        $status = DB::table('product_models')->where('id', $id)->whereNull('deleted_at')->update(['deleted_at' => now()]);
        if($status){
            return Response::withOk("Product model" . Message::$delSuccess, $status);
        }
        return Response::withBadRequest("Product model" . Message::$delFailed);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product_model']['restore'] . ' product_model');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Product model id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'product_model',
            'restore',
            'product_models',
            $id,
            null,
            null,
        );
        $status = DB::table('product_models')->where('id', $id)->whereNotNull('deleted_at')->update(['deleted_at' => Null]);
        if($status){
            return Response::withOk("Product model" . Message::$restoreSuccess, $status);
        }
        return Response::withBadRequest("Product model" . Message::$restoreFailed);

    }
}

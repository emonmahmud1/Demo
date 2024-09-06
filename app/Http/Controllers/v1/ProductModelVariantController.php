<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Events;
use App\Main\Permissions;
use App\Main\Tracelogs;
use App\Models\ProductModelVariant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProductModelVariantController extends Controller
{
    private static function report(array $queries = [])
    {
        $product_model_variants = DB::table('product_model_variants')
            ->join('product_models as cc', 'product_model_variants.product_model_id', '=', 'cc.id')
            ->join('products', 'cc.product_id', '=', 'products.id')
            ->select('product_model_variants.*', 'products.name as product_name', 'cc.name as product_model_name')
            ->whereNull('product_model_variants.deleted_at');

        if (isset($queries['id'])) {
            $product_model_variants = $product_model_variants->where('product_model_variants.id', $queries['id']);
        }
        if (isset($queries['product_id'])) {
            $product_model_variants = $product_model_variants->where('product_model_variants.product_id', $queries['product_id']);
        }
        if (isset($queries['product_model_id'])) {
            $product_model_variants = $product_model_variants->where('product_model_variants.product_model_id', $queries['product_model_id']);
        }
        if (isset($queries['list'])) {
            $product_model_variants = $product_model_variants->get();
        } else {
            $product_model_variants = $product_model_variants->first();
        }
        return $product_model_variants;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product_model_variant']['read'] . ' product_model_variant');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }

        $validation = Validator::make(request()->all(), [
            'product_id' => [
                'nullable',
                'integer',
                Rule::exists('product_model_variants', 'product_id')
                    ->when(request('product_model_id'), function ($query) {
                        $query->where('product_model_id', request('product_model_id')->whereNull('deleted_at'));
                    })
            ],
            'product_model_id' => [
                'nullable',
                'integer',
                Rule::exists('product_model_variants', 'product_model_id')
                    ->when(request('product_id'), function ($query) {
                        $query->where('product_id', request('product_id')->whereNull('deleted_at'));
                    })
            ],
        ]);
        if ($validation->fails()) {
            return Response::withBadRequest("Validation failed", $validation->errors());
        }
        $product_model_variants =  self::report(array_merge($validation->validated(), ['list' => true]));
    
        return Response::withOk("All the product model variants" . Message::$fetchSuccess, $product_model_variants);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product_model_variant']['create'] . ' product_model_variant');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'product_model_id' => [
                'required',
                'integer',
                Rule::exists('product_models', 'id')
                    ->where('product_id', request('product_id'))
                    ->whereNull('deleted_at')
            ],
            'name' => ['required', 'string', 'max:150'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Product model variants" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        $product_model_variant_id = DB::table('product_model_variants')->insertGetId([
            'product_id' => $validatedData['product_id'],
            'product_model_id' => $validatedData['product_model_id'],
            'name' => $validatedData['name'],
            'created_at' => now(),
        ]);
        Tracelogs::AddTraceLogs(
            'product_model_variant',
            'new',
            'product_model_variants',
            $product_model_variant_id,
            null,
            null,
        );
        $product_model_variant = self::report(array_merge(['id'=>$product_model_variant_id]));

        return Response::withCreated("Product model variants" . Message::$createSuccess, $product_model_variant);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product_model_variant']['read'] . ' product_model_variant');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Product model variant id" . Message::$invalid);
        }
        $product_model_variant = self::report(array_merge(['id'=> $id]));
        if ($product_model_variant) {
            return Response::withOk("Product model variant" . Message::$fetchSuccess, $product_model_variant);
        }
        return Response::withNotFound("Product model variant" . Message::$fetchFailed, $product_model_variant);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product_model_variant']['update'] . ' product_model_variant');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'product_model_id' => [
                'required',
                'integer',
                Rule::exists('product_models', 'id')
                    ->where('product_id', request('product_id'))
                    ->whereNull('deleted_at')
            ],
            'id' => [
                'required',
                'integer',
                Rule::exists('product_model_variants', 'id')
                    ->whereNull('deleted_at')
            ],
            'name' => ['required', 'string', 'max:150'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Product model variant" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();
        Tracelogs::AddTraceLogs(
            'product_model_variant',
            'update',
            'product_model_variants',
            $validatedData['id'],
            ProductModelVariant::find($validatedData['id']),
            null,
        );
        $product_model_variant = DB::table('product_model_variants')->where('id', $validatedData['id'])->update([
            'product_id' => $validatedData['product_id'],
            'product_model_id' => $validatedData['product_model_id'],
            'name' => $validatedData['name'],
            'updated_at' => now()
        ]);
        if ($product_model_variant) {

            return Response::withCreated("Product model variant" . Message::$updateSuccess, $validatedData);
        }

        return Response::withBadRequest("Product model variant" . Message::$updateFailed, $validatedData);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product_model_variant']['delete'] . ' product_model_variant');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Product model variant id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'product_model_variant',
            'delete',
            'product_model_variants',
            $id,
            ProductModelVariant::find($id),
            null,
        );
        $status = DB::table('product_model_variants')->where('id', $id)->whereNull('deleted_at')->update(['deleted_at' => now()]);
        if($status){
            return Response::withOk("Product model variant" . Message::$delSuccess, $status);
        }
        return Response::withBadRequest("Product model variant" . Message::$delFailed);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product_model_variant']['restore'] . ' product_model_variant');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Product model variant id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'product_model_variant',
            'restore',
            'product_model_variants',
            $id,
            null,
            null,
        );
        $status = DB::table('product_model_variants')->where('id', $id)->whereNotNull('deleted_at')->update(['deleted_at' => Null]);
        if($status){
            return Response::withOk("Product model variant" . Message::$restoreSuccess, $status);
        }
        return Response::withBadRequest("Product model variant" . Message::$restoreFailed);
    }
}

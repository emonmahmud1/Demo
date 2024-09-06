<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Events;
use App\Main\Permissions;
use App\Main\Tracelogs;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    private static function report(array $queries = [])
    {
        $products = DB::table('products')
            ->select('products.*')
            ->whereNull('deleted_at');
        if (isset($queries['id'])) {
            $products = $products->where('id', $queries['id']);
        }
        if (isset($queries['list'])) {
            $products = $products->get();
        } else {
            $products = $products->first();
        }
        return $products;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm=User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product']['read']. ' product');
        if(!$checkPerm){
            return Response::withForbidden("User".Message::$forbidden);
        }
        $products = self::report(array_merge([], ['list' => true]));
        
        return Response::withOk("All the products" . Message::$fetchSuccess, $products);
   
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm=User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product']['create']. ' product');
        if(!$checkPerm){
            return Response::withForbidden("User".Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:50'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Product" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        $productId = DB::table('products')->insertGetId([
            'name' => $validatedData['name'],
            'created_at'=>now(),
        ]);
        Tracelogs::AddTraceLogs(
            'product',
            'new',
            'products',
            $productId,
            null,
            null,
        );
        $product=self::report(array_merge(['id'=>$productId]));;

        return Response::withCreated("Product" . Message::$createSuccess, $product);
   
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm=User::find(Auth::user()->id)->hasPermissionTo(Permissions::$permissions['product']['read']. ' product');
        if(!$checkPerm){
            return Response::withForbidden("User".Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Product id" . Message::$invalid);
        }
        $product =self::report(array_merge(['id'=>$id]));
        if ($product) {
            return Response::withOk("Product" . Message::$fetchSuccess, $product);
        }
        return Response::withNotFound("Product" . Message::$fetchFailed, $product);
  
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm=User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product']['update']. ' product');
        if(!$checkPerm){
            return Response::withForbidden("User".Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'id' => ['required', 'integer', 'exists:products,id'],
            'name' => ['required', 'string', 'max:50'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Product" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();
        Tracelogs::AddTraceLogs(
            'product',
            'update',
            'products',
            $validatedData['id'],
            Product::find($validatedData['id']),
            null,
        );
        $product = DB::table('products')->where('id', $validatedData['id'])->update([
            'name' => $validatedData['name'],
            'updated_at'=>now()
        ]);
        if ($product) {

            return Response::withCreated("Product" . Message::$updateSuccess, $validatedData);
        }

        return Response::withBadRequest("Product" . Message::$updateFailed, $validatedData);
   
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm=User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product']['delete']. ' product');
        if(!$checkPerm){
            return Response::withForbidden("User".Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Product id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'product',
            'delete',
            'products',
            $id,
            Product::find($id),
            null,
        );
        $status = DB::table('products')->where('id', $id)->whereNull('deleted_at')->update(['deleted_at' => now()]);
        if($status){
            return Response::withOk("Product" . Message::$delSuccess, $status);
        }
        return Response::withBadRequest("Product" . Message::$delFailed);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm=User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['product']['restore']. ' product');
        if(!$checkPerm){
            return Response::withForbidden("User".Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Product id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'product',
            'restore',
            'products',
            $id,
            null,
            null,
        );

        $status = DB::table('products')->where('id', $id)->whereNotNull('deleted_at')->update(['deleted_at' => Null]);
        if($status){
            return Response::withOk("Product" . Message::$restoreSuccess, $status);
        }
        return Response::withBadRequest("Product" . Message::$restoreFailed);
    }
}

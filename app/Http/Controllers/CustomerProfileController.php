<?php

namespace App\Http\Controllers;

use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Permissions;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['customer_profile']['read'] . ' customer_profile');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState=Validator::make(request()->all(),[
            'customer_phone'=>['required','string','exists:customer_profiles,customer_phone']
        ]);

        if($validationState->fails()){
            return Response::withBadRequest("Customer profile".Message::$validationFailed,$validationState->errors());
        }
        $validatedData=$validationState->validated();
        $prof=DB::table('customer_profiles')->where('customer_phone',$validatedData['customer_phone'])->whereNull('deleted_at')->first();
        if($prof){
            return Response::withOk("Customer profile".Message::$fetchSuccess,$prof);
        }
        return Response::withNotFound("Customer profile".Message::$fetchFailed);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

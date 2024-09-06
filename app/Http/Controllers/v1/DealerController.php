<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Events;
use App\Main\Permissions;
use App\Main\Tracelogs;
use App\Models\Dealer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DealerController extends Controller
{
    private static function report(array $queries = [])
    {
        $dealers = DB::table('dealers')
            ->select('dealers.*')
            ->whereNull('deleted_at');

        if (isset($queries['id'])) {
            $dealers = $dealers->where('id', $queries['id']);
        }
        if (isset($queries['list'])) {
            $dealers = $dealers->get();
        } else {
            $dealers = $dealers->first();
        }
        return $dealers;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['dealer']['read'] . ' dealer');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $dealers = self::report(array_merge([], ['list' => true]));
        if (count($dealers) > 0) {
            return Response::withOk("All the dealers" . Message::$fetchSuccess, $dealers);
        }
        return Response::withNotFound("All the dealers" . Message::$fetchFailed, $dealers);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['dealer']['create'] . ' dealer');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'type' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:50'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Dealer" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        $dealerId = DB::table('dealers')->insertGetId([
            'name' => $validatedData['name'],
            'type' => $validatedData['type'],
            'created_at' => now(),
        ]);
        Tracelogs::AddTraceLogs(
            'dealer',
            'new',
            'dealers',
            $dealerId,
            null,
            null,
        );
        $dealer = self::report(array_merge(['id' => $dealerId]));
        return Response::withCreated("Dealer" . Message::$createSuccess, $dealer);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['dealer']['read'] . ' dealer');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Dealer id" . Message::$invalid);
        }
        $dealer = self::report(array_merge(['id' => $id]));
        if ($dealer) {
            return Response::withOk("Dealer" . Message::$fetchSuccess, $dealer);
        }
        return Response::withNotFound("Dealer" . Message::$fetchFailed, $dealer);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['dealer']['update'] . ' dealer');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'id' => ['required', 'integer', 'exists:dealers,id'],
            'type' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:50'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Dealer" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();

        Tracelogs::AddTraceLogs(
            'dealer',
            'update',
            'dealers',
            $validatedData['id'],
            Dealer::find($validatedData['id']),
            null,
        );
        $dealer = DB::table('dealers')->where('id', $validatedData['id'])->whereNull('deleted_at')->update([
            'name' => $validatedData['name'],
            'type' => $validatedData['type'],
            'updated_at' => now()
        ]);
        if ($dealer) {
            return Response::withCreated("Dealer" . Message::$updateSuccess, $validatedData);
        }

        return Response::withBadRequest("Dealer" . Message::$updateFailed, $dealer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['dealer']['delete'] . ' dealer');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Dealer id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'dealer',
            'delete',
            'dealers',
            $id,
            Dealer::find($id),
            null,
        );
        $status = DB::table('dealers')->where('id', $id)->whereNull('deleted_at')->update(['deleted_at' => now()]);
        if ($status) {
            return Response::withOk("Dealer" . Message::$delSuccess);
        }
        return Response::withBadRequest("Dealer" . Message::$delFailed);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['dealer']['restore'] . ' dealer');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Dealer id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'dealer',
            'restore',
            'dealers',
            $id,
            null,
            null,
        );

        $status = DB::table('dealers')->where('id', $id)->whereNotNull('deleted_at')->update(['deleted_at' => Null]);
        if ($status) {
            return Response::withOk("Dealer" . Message::$restoreSuccess);
        }
        return Response::withBadRequest("Dealer" . Message::$restoreFailed);
    }
}

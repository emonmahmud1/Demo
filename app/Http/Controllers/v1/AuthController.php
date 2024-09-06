<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Events;
use App\Main\Permissions;
use App\Main\Report\User as ReportUser;
use App\Main\Tracelogs;
use App\Models\User;
use Illuminate\Validation\Rules;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Login of the resource.
     */
    public function login(Request $request)
    {
        $validationState = Validator::make($request->all(), [
            'employee_id' => ['required', 'string', 'exists:users,employee_id'],
            'password' => ['required', 'string','min:8']
        ]);
        if ($validationState->fails()) {
            return Response::withNotFound("User email and password" . Message::$invalid, $validationState->errors());
        }
        $validatedData = $validationState->validated();
        if (!Auth::attempt($request->only(['employee_id', 'password']))) {
            return Response::withBadRequest("User email and password" . Message::$invalid);
        }
        $userCheck = DB::table('users')->where('employee_id', $validatedData['employee_id'])->whereNull('deleted_at')->first();
        if (!$userCheck) {
            return Response::withNotFound("User email and password" . Message::$invalid);
        }
        $userDetails = ReportUser::getWithRolesPerms($userCheck->id);
        $user = User::find($userCheck->id);
        Tracelogs::AddTraceLogs(
            'user',
            'login',
            'users',
            $validatedData['employee_id'],
            Events::$events['user'].' '.Events::$event_names['login'] .' by user_id:'.Auth::id(),
            null,
            $userCheck->id,
        );

        if (!$user) {
            return Response::withNotFound("User" . Message::$notFound);
        }
        $token = $user->createToken("web")->plainTextToken;
        
        $user->tokens()->latest()->first()->forceFill([
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ])->save();
        return Response::withOk("User" . Message::$loginSuccess, ['user' => $userDetails, 'token' => $token]);
    }

    /**
     * Login resource with ID in storage.
     */
    public function loginWithEmployeeID(Request $request)
    {
        $validationState = Validator::make($request->all(), [
            'employee_id' => ['required', 'string', 'exists:users,employee_id']
        ]);
        if ($validationState->fails()) {
            return Response::withNotFound("User email and password" . Message::$invalid, $validationState->errors());
        }
        $validatedData = $validationState->validated();
        $checkUser = DB::table('users')->whereNotNull('deleted_at')->where('employee_id', $validatedData['employee_id'])->exists();
        if ($checkUser) {
            return Response::withForbidden("User login" . Message::$forbidden);
        }

        $ip_long = ip2long($request->ip());
        $start_ip = ip2long("172.17.0.0");
        $end_ip = ip2long("172.17.0.255");
        if (!($ip_long >= $start_ip && $ip_long <= $end_ip)) {
            return Response::withForbidden("User login" . Message::$forbidden);
        }
        $user = ReportUser::find(['employee_id' => $validatedData['employee_id']]);
        Tracelogs::AddTraceLogs(
            'user',
            'login',
            'users',
            $user->id,
            null,
            $request->employee_id,
        );

        $userAgent = DB::table('model_has_roles')
            ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->where('model_has_roles.model_id', $user->id)
            ->where('roles.name', 'Agent')
            ->exists();
        if (!$userAgent) {
            return Response::withForbidden("Agent id" . Message::$invalid);
        }
        $user = User::find($user->id);
        $token = $user->createToken(
            'API Token of ' . $user->name
        )->plainTextToken;
        $user->tokens()->latest()->first()->forceFill([
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ])->save();
        return Response::withOk("User" . Message::$loginSuccess, ['user' => $user, 'token' => $token]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function register(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['user']['create'] . ' user');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'employee_id' => ['required','string', 'unique:users,employee_id'],
            'name' => ['required', 'string', 'max:50'],
            'email' => ['email', 'max:50', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed', Rules\Password::defaults()],
            'phone_number' => ['required', 'string', 'max:11'],
            'date_of_birth' => ['date'],
            'gender' => ['required', 'string', 'max:10'],
            'address' => ['string', 'max:250'],
            'roles_list' => ['required', 'array'],
            'roles_list.*' => ['required', 'integer', 'exists:roles,id']
        ]);
        $validatedData = $validationState->validated();

        if ($validationState->fails()) {
            return Response::withBadRequest("User" . Message::$validationFailed, $validationState->errors());
        }
        $checkUser = DB::table('users')->where('employee_id', $validatedData['employee_id'])->exists();
        if ($checkUser) {
            return Response::withBadRequest("Duplicate entry employee_id" . Message::$invalid, $checkUser);
        }
        $userId = DB::table('users')->insertGetId([
            'department_id' => $validatedData['department_id'],
            'employee_id' => $validatedData['employee_id'],
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'phone_number' => $validatedData['phone_number'],
            'date_of_birth' => $validatedData['date_of_birth'],
            'gender' => $validatedData['gender'],
            'address' => $validatedData['address'],
            'created_at' => now(),
        ]);
        Tracelogs::AddTraceLogs(
            'user',
            'new',
            'users',
            $userId,
            null,
            null,
            null,
        );

        $userDetails=User::find($userId);

        if ($userDetails) {
            $userDetails->syncRoles($validatedData['roles_list']);
            return Response::withCreated("User" . Message::$createSuccess, $userDetails);
        }
        return Response::withBadRequest("User" . Message::$createFailed, $userDetails);
    }

    /**
     * Logout the specified resource.
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return Response::withUnauthorized("User" . Message::$notAuthorized, $user);
        }
        Tracelogs::AddTraceLogs(
            'user',
            'logout',
            'users',
            Auth::id(),
            null,
            null,
        );
        $user->tokens()->delete();
        return Response::withOk("User" . Message::$logoutSuccess);
    }

    public function showPermsAndRoles()
    {
        $user = ReportUser::getWithRolesPerms(Auth::id());
        return Response::withOk("User permissions and roles" . Message::$fetchSuccess, $user);
    }
}

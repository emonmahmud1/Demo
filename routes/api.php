<?php

use App\Http\Controllers\CallSubCategoryMailController;
use App\Http\Controllers\CustomerProfileController;
use App\Http\Controllers\v1\SMTPController;
use App\Http\Controllers\v1\AuthController;
use App\Http\Controllers\v1\CallCategoryController;
use App\Http\Controllers\v1\CallSubCategoryController;
use App\Http\Controllers\v1\CallTypeController;
use App\Http\Controllers\v1\DashboardController;
use App\Http\Controllers\v1\DealerController;
use App\Http\Controllers\v1\DepartmentController;
use App\Http\Controllers\v1\DistrictController;
use App\Http\Controllers\v1\LocationController;
use App\Http\Controllers\v1\PermissionController;
use App\Http\Controllers\v1\ProductController;
use App\Http\Controllers\v1\ProductModelController;
use App\Http\Controllers\v1\ProductModelVariantController;
use App\Http\Controllers\v1\RoleController;
use App\Http\Controllers\v1\SessionController;
use App\Http\Controllers\v1\TicketController;
use App\Http\Controllers\v1\UpazilaController;
use App\Http\Controllers\v1\UserController;
use App\Main\EmailServices;
use Illuminate\Contracts\Session\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/login-id', [AuthController::class, 'loginWithEmployeeID']);


    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'showPermsAndRoles']);

        //Sessions
        Route::get('/sessions', [SessionController::class, 'index']);
        Route::get('/sessions/user/{id}', [SessionController::class, 'show']);
        Route::delete('/sessions/{id}', [SessionController::class, 'destroy']);


        //Roles
        Route::post('/roles', [RoleController::class, 'store']);
        Route::get('/roles', [RoleController::class, 'index']);
        Route::get('/roles/{id}', [RoleController::class, 'show']);
        Route::delete('/roles/{id}', [RoleController::class, 'destroy']);
        Route::put('/roles', [RoleController::class, 'update']);
        Route::post('/roles-user', [RoleController::class, 'assignToUser']);

        //Permissions
        Route::get('/permissions', [PermissionController::class, 'index']);
        Route::get('/permissions/{id}', [PermissionController::class, 'show']);
        Route::post('/permissions-user', [PermissionController::class, 'assignToUser']);
        Route::post('/permissions-role', [PermissionController::class, 'assignToRole']);

        //Users
        Route::prefix('/users')->group(function () {
            Route::get('/', [UserController::class, 'index']);
            Route::get('/{id}', [UserController::class, 'show']);
            Route::get('/deleted/list',[UserController::class,'getDeletedUsers']);
            Route::delete('/{id}', [UserController::class, 'destroy']);
            Route::post('/{id}', [UserController::class, 'restore']);
            Route::put('/', [UserController::class, 'update']);
            Route::put('/change', [UserController::class, 'updatePassword']);
            Route::put('/reset', [UserController::class, 'resetPassword']);
        });

        //Customer Profiles
        Route::get('/customer_profiles', [CustomerProfileController::class, 'show']);


        //SMTPs
        Route::prefix('/s_m_t_p_s')->group(function () {
            Route::get('/', [SMTPController::class, 'index']);
            Route::post('/', [SMTPController::class, 'store']);
            Route::get('/{id}', [SMTPController::class, 'show']);
            Route::delete('/{id}', [SMTPController::class, 'destroy']);
            Route::post('/{id}', [SMTPController::class, 'restore']);
            Route::put('/', [SMTPController::class, 'update']);
        });


        //Call Types
        Route::prefix('/call_types')->group(function () {
            Route::get('/', [CallTypeController::class, 'index']);
            Route::post('/', [CallTypeController::class, 'store']);
            Route::get('/{id}', [CallTypeController::class, 'show']);
            Route::delete('/{id}', [CallTypeController::class, 'destroy']);
            Route::post('/{id}', [CallTypeController::class, 'restore']);
            Route::post('/status/{id}', [CallTypeController::class, 'changeStatus']);
            Route::put('/', [CallTypeController::class, 'update']);
        });

        //Call Category
        Route::prefix('/call_categories')->group(function () {
            Route::get('/', [CallCategoryController::class, 'index']);
            Route::post('/', [CallCategoryController::class, 'store']);
            Route::get('/{id}', [CallCategoryController::class, 'show']);
            Route::delete('/{id}', [CallCategoryController::class, 'destroy']);
            Route::post('/{id}', [CallCategoryController::class, 'restore']);
            Route::post('/status/{id}', [CallCategoryController::class, 'changeStatus']);
            Route::put('/', [CallCategoryController::class, 'update']);
        });

        //Call Sub Category
        Route::prefix('/call_sub_categories')->group(function () {
            Route::get('/', [CallSubCategoryController::class, 'index']);
            Route::post('/', [CallSubCategoryController::class, 'store']);
            Route::get('/{id}', [CallSubCategoryController::class, 'show']);
            Route::delete('/{id}', [CallSubCategoryController::class, 'destroy']);
            Route::post('/{id}', [CallSubCategoryController::class, 'restore']);
            Route::post('/status/{id}', [CallSubCategoryController::class, 'changeStatus']);
            Route::put('/', [CallSubCategoryController::class, 'update']);
        });

        //Ticket
        Route::prefix('/tickets')->group(function () {
            Route::get('/', [TicketController::class, 'index']);
            Route::post('/', [TicketController::class, 'store']);
            Route::get('/{id}', [TicketController::class, 'show']);
            Route::delete('/{id}', [TicketController::class, 'destroy']);
            Route::post('/{id}', [TicketController::class, 'restore']);
            Route::put('/', [TicketController::class, 'update']);

            //Tickets->Department
            Route::post('/remarks/comments/{id}', [TicketController::class, 'giveRemarks']);
            Route::post('/forward/{id}', [TicketController::class, 'forwardTicket']);
            Route::post('/solve/{id}', [TicketController::class, 'solveTicket']);
        });

        //Department
        Route::prefix('/departments')->group(function () {
            Route::get('/', [DepartmentController::class, 'index']);
            Route::post('/', [DepartmentController::class, 'store']);
            Route::get('/{id}', [DepartmentController::class, 'show']);
            Route::delete('/{id}', [DepartmentController::class, 'destroy']);
            Route::post('/{id}', [DepartmentController::class, 'restore']);
            Route::put('/', [DepartmentController::class, 'update']);
        });

        //District
        Route::prefix('/districts')->group(function () {
            Route::get('/', [DistrictController::class, 'index']);
            Route::post('/', [DistrictController::class, 'store']);
            Route::get('/{id}', [DistrictController::class, 'show']);
            Route::delete('/{id}', [DistrictController::class, 'destroy']);
            Route::post('/{id}', [DistrictController::class, 'restore']);
            Route::put('/', [DistrictController::class, 'update']);
        });

        //Upazila
        Route::prefix('/upazilas')->group(function () {
            Route::get('/', [UpazilaController::class, 'index']);
            Route::post('/', [UpazilaController::class, 'store']);
            Route::get('/{id}', [UpazilaController::class, 'show']);
            Route::delete('/{id}', [UpazilaController::class, 'destroy']);
            Route::post('/{id}', [UpazilaController::class, 'restore']);
            Route::put('/', [UpazilaController::class, 'update']);
        });

        //Location
        Route::prefix('/locations')->group(function () {
            Route::get('/', [LocationController::class, 'index']);
            Route::post('/', [LocationController::class, 'store']);
            Route::get('/{id}', [LocationController::class, 'show']);
            Route::delete('/{id}', [LocationController::class, 'destroy']);
            Route::post('/{id}', [LocationController::class, 'restore']);
            Route::put('/', [LocationController::class, 'update']);
        });

        //Dealer
        Route::prefix('/dealers')->group(function () {
            Route::get('/', [DealerController::class, 'index']);
            Route::post('/', [DealerController::class, 'store']);
            Route::get('/{id}', [DealerController::class, 'show']);
            Route::delete('/{id}', [DealerController::class, 'destroy']);
            Route::post('/{id}', [DealerController::class, 'restore']);
            Route::put('/', [DealerController::class, 'update']);
        });

        //Product
        Route::prefix('/products')->group(function () {
            Route::get('/', [ProductController::class, 'index']);
            Route::post('/', [ProductController::class, 'store']);
            Route::get('/{id}', [ProductController::class, 'show']);
            Route::delete('/{id}', [ProductController::class, 'destroy']);
            Route::post('/{id}', [ProductController::class, 'restore']);
            Route::put('/', [ProductController::class, 'update']);
        });

        //Product Model
        Route::prefix('/product_models')->group(function () {
            Route::get('/', [ProductModelController::class, 'index']);
            Route::post('/', [ProductModelController::class, 'store']);
            Route::get('/{id}', [ProductModelController::class, 'show']);
            Route::delete('/{id}', [ProductModelController::class, 'destroy']);
            Route::post('/{id}', [ProductModelController::class, 'restore']);
            Route::put('/', [ProductModelController::class, 'update']);
        });

        //Product Model Variant
        Route::prefix('/product_model_variants')->group(function () {
            Route::get('/', [ProductModelVariantController::class, 'index']);
            Route::post('/', [ProductModelVariantController::class, 'store']);
            Route::get('//{id}', [ProductModelVariantController::class, 'show']);
            Route::delete('/{id}', [ProductModelVariantController::class, 'destroy']);
            Route::post('/{id}', [ProductModelVariantController::class, 'restore']);
            Route::put('/', [ProductModelVariantController::class, 'update']);
        });

        //Dashboard
        Route::prefix('/dashboard')->group(function () {
            Route::get('/query', [DashboardController::class, 'getTicketQuery']);
            Route::get('/complaint', [DashboardController::class, 'getTicketComplaint']);
            Route::get('/cftr', [DashboardController::class, 'getTicketCftr']);
            Route::get('/source', [DashboardController::class, 'getSixMonthsSource']);
            Route::get('/count', [DashboardController::class, 'getTopTicketCount']);
            Route::get('/solve', [DashboardController::class, 'getTopTenSolvedTime']);
        });
    });
});

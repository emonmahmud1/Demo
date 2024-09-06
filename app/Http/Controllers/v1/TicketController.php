<?php

namespace App\Http\Controllers\v1;

use App\Events\TicketCreated;
use App\Http\Controllers\Controller;
use App\Http\Controllers\MailController;
use App\Main\EmailServices;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Events;
use App\Main\Permissions;
use App\Main\Report\Ticket as TicketReport;
use App\Main\TicketForwardlogs;
use App\Main\TicketStatus;
use App\Main\Tracelogs as Tracelogs;
use App\Models\CallSubCategory;
use App\Models\CallSubCategoryMail;
use App\Models\SMTP;
use App\Models\Ticket;
use App\Models\TicketForwardLog;
// use App\Models\TraceLogs;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['ticket']['read'] . ' ticket');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validation = Validator::make(request()->all(), [
            'call_type_id' => ['integer', 'exists:tickets,call_type_id'],
            'call_category_id' => ['integer', 'exists:tickets,call_category_id'],
            'call_sub_category_id' => [
                'integer',
                Rule::exists('call_sub_categories', 'id')
                    ->when(request('call_type_id'), function ($query) {
                        $query->where('call_type_id', request('call_type_id'));
                    })
                    ->when(request('call_category_id'), function ($query) {
                        $query->where('call_category_id', request('call_category_id'));
                    })

            ],
            'product_id' => ['integer', 'exists:tickets,product_id'],
            'product_model_id' => ['integer', 'exists:tickets,product_model_id'],
            'product_model_variant_id' => [
                'integer',
                Rule::exists('product_model_variants', 'id')
                    ->when(request('product_id'), function ($query) {
                        $query->where('product_id', request('product_id'));
                    })
                    ->when(request('product_model_id'), function ($query) {
                        $query->where('product_model_id', request('product_model_id'));
                    })


            ],
            'department_id' => [
                'integer', Rule::exists('tickets', 'department_id')
                    ->when(request('id'), function ($query) {
                        $query->where('id', request('id')->whereNull('deleted_at'));
                    })
            ],
        ]);

        if ($validation->fails()) {
            return Response::withBadRequest("Validation failed", $validation->errors());
        }
        $ticket = TicketReport::all($validation->validated());

        if (count($ticket) > 0) {
            return Response::withOk("Tickets" . Message::$fetchSuccess, $ticket);
        }
        return Response::withNotFound("Tickets" . Message::$fetchFailed, $ticket);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['ticket']['create'] . ' ticket');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'call_type_id' => ['required', 'integer', 'exists:call_types,id'],
            'call_category_id' => ['required', 'integer', 'exists:call_categories,id'],
            'call_sub_category_id' => [
                'required',
                'integer',
                Rule::exists('call_sub_categories', 'id')
                    ->where('call_type_id', request('call_type_id'))
                    ->where('call_category_id', request('call_category_id'))
                    ->whereNull('deleted_at')

            ],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'product_model_id' => ['required', 'integer', 'exists:product_models,id'],
            'product_model_variant_id' => [
                'required',
                'integer',
                Rule::exists('product_model_variants', 'id')
                    ->where('product_id', request('product_id'))
                    ->where('product_model_id', request('product_model_id'))
                    ->whereNull('deleted_at')

            ],
            'department_id' => ['integer', 'exists:departments,id'],
            'customer_name' => ['string'],
            'customer_phone' => ['required', 'string'],
            'address' => ['string'],
            'alternate_number' => ['string'],
            'vehicle_registration_number' => ['required', 'string'],
            'registered_phone_number' => ['string'],
            'odometer_reading' => ['string'],
            'date_of_purchase' => ['date'],
            'engine_number' => ['string'],
            'chasis_number' => ['string'],
            'last_servicing_date' => ['date'],
            'servicing_count' => ['integer'],
            'warranty_status' => ['string'],
            'source' => ['required', 'string'],
            'remarks' => ['string'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Ticket" . Message::$validationFailed, $validationState->errors());
        }

        $validatedData = $validationState->validated();
        $check = DB::table('customer_profiles')->where('customer_phone', $validatedData['customer_phone'])->whereNull('deleted_at')->exists();
        if (!$check && !isset($validatedData['customer_name']) && !isset($validatedData['address']) && !isset($validatedData['alternate_number']) && !isset($validatedData['registered_phone_number'])) {
            return Response::withBadRequest("Please provide customer_name, address, alternate_number and registered_phone_number.");
        }
        $checkCustomer = DB::table('customer_profiles')->where('customer_phone', $validatedData['customer_phone'])->whereNull('deleted_at')->first();
        $customer_phone = $validatedData['customer_phone'];
        $customer_name = isset($validatedData['customer_name']) ? $validatedData['customer_name'] : $checkCustomer->customer_name;
        $address = isset($validatedData['address']) ? $validatedData['address'] : $checkCustomer->address;
        $alternate_number = isset($validatedData['alternate_number']) ? $validatedData['alternate_number'] : $checkCustomer->alternate_number;
        $registered_phone_number = isset($validatedData['registered_phone_number']) ? $validatedData['registered_phone_number'] : $checkCustomer->registered_phone_number;
        $department = DB::table('call_sub_categories')->whereNull('deleted_at')->where('id', $validatedData['call_sub_category_id'])->first();

        $customer_profile_id = $check ? $checkCustomer->id : 0;

        if (!$checkCustomer) {
            $check = DB::table('customer_profiles')->insertGetId([
                'customer_name' => $customer_name,
                'customer_phone' => $customer_phone,
                'alternate_number' => $alternate_number,
                'address' => $address,
                'registered_phone_number' => $registered_phone_number
            ]);
        }
        $callId = TicketReport::generateId();

        $id = DB::table('tickets')->insertGetId([
            'tracking_id' => $callId,
            'call_type_id' => $validatedData['call_type_id'],
            'call_category_id' => $validatedData['call_category_id'],
            'call_sub_category_id' => $validatedData['call_sub_category_id'],
            'product_id' => $validatedData['product_id'],
            'product_model_id' => $validatedData['product_model_id'],
            'product_model_variant_id' => $validatedData['product_model_variant_id'],
            'customer_profile_id' => $customer_profile_id,
            'department_id' => $department->department_id,
            // 'customer_name' => $customer_name,
            'customer_phone' => $customer_phone,
            // 'address' => $address,
            // 'alternate_number' => $alternate_number,
            // 'registered_phone_number' => $registered_phone_number,
            'vehicle_registration_number' => $validatedData['vehicle_registration_number'],
            'odometer_reading' => $validatedData['odometer_reading'],
            'date_of_purchase' => $validatedData['date_of_purchase'],
            'engine_number' => $validatedData['engine_number'],
            'chasis_number' => $validatedData['chasis_number'],
            'last_servicing_date' => $validatedData['last_servicing_date'],
            'servicing_count' => $validatedData['servicing_count'],
            'warranty_status' => $validatedData['warranty_status'],
            'source' => $validatedData['source'],
            'status' => 'New',
            'remarks' => $validatedData['remarks'],
            'created_at' => now(),
        ]);
        Tracelogs::AddTraceLogs(
            'ticket',
            'new',
            'tickets',
            $id,
            Events::$event_names['new'].' '.Events::$events['ticket']. ' by user_id:'.Auth::id(),
            null,
            null,
        );
    
        $ticket = Ticket::find($id);
        event(new TicketCreated($ticket));
        return Response::withCreated("Ticket" . Message::$createSuccess, $ticket);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find(Auth::id());
        $checkPerm = $user->hasPermissionTo(Permissions::$permissions['ticket']['read'] . ' ticket');
        if (!$checkPerm) {
            return Response::withForbidden("Ticket " . Message::$forbidden, $checkPerm);
        }

        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Ticket id" . Message::$invalid);
        }
        $tickets = TicketReport::find(['id' => $id]);

        $checkDept = DB::table('tickets')
            ->where('department_id', $user->department_id)
            ->whereNull('deleted_at')
            ->whereNull('forwarded_to_department_id')
            ->whereNull('opened_by_user_id')
            ->exists();

        $checkOpened = DB::table('tickets')
            ->where('opened_by_user_id', $user->id)
            ->whereNull('deleted_at')
            ->whereNull('forwarded_to_department_id')
            ->exists();

        $checkUsers = DB::table('tickets')
            ->where('department_id', $user->department_id)
            ->exists();

        $checkForwarded = DB::table('tickets')
            ->where('forwarded_to_department_id', $user->department_id)
            ->exists();

        if ($checkDept || $checkForwarded) {
            $update_status = DB::table('tickets')->where('id', $id)->update([
                'opened_by_user_id' => $user->id,
                'status' => TicketStatus::$statuses['wip'],
                'department_opened_time' => now(),
                'updated_at' => now()
            ]);
            if ($update_status) {
                return Response::withOk("Ticket" . Message::$fetchSuccess, $tickets);
            }
        }
        $checkForwarded = DB::table('tickets')
            ->where('forwarded_to_department_id', $user->department_id)
            ->whereNull('deleted_at')
            ->exists();

        if ($checkOpened || $checkForwarded || $checkUsers) {
            return Response::withOk("Ticket" . Message::$fetchSuccess, $tickets);
        }
        if (!$checkDept && !$checkOpened && !$checkForwarded) {
            return Response::withForbidden("User not authorized to view ticket");
        }

        $tickets = TicketReport::find(['id' => $id,]);
        $tickets->log=array_merge(['log'=>DB::table('trace_logs')->where('table_name','tickets')->where('effected_row_id',$id)->get()]);
        $tickets->endpoint=array_merge(['endpoint'=>Events::$events_endpoints['ticket'].$id]);
        if (!$tickets) {
            return Response::withNotFound("Ticket" . Message::$fetchFailed, $tickets);
        }

        return Response::withNotFound("Ticket" . Message::$fetchFailed, $update_status);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['ticket']['update'] . ' ticket');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        $validationState = Validator::make($request->all(), [
            'id' => ['required', 'integer', 'exists:tickets,id'],
            'tracking_id' => [
                'required',
                'string',
                Rule::exists('tickets', 'tracking_id')
                    ->where('id', request('id'))
            ],
            'call_type_id' => ['required', 'integer', 'exists:call_types,id'],
            'call_category_id' => ['required', 'integer', 'exists:call_categories,id'],
            'call_sub_category_id' => ['required', 'integer', 'exists:call_sub_categories,id'],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'product_model_id' => ['required', 'integer', 'exists:product_models,id'],
            'product_model_variant_id' => ['required', 'integer', 'exists:product_model_variants,id'],
            'department_id' => [
                'required', 'integer', Rule::exists('tickets', 'department_id')->where('id', request('id'))
            ],
            'customer_name' => ['required', 'string'],
            'customer_phone' => ['required', 'string'],
            'address' => ['required', 'string'],
            'alternate_number' => ['string'],
            'registered_phone_number' => ['string'],
            'vehicle_registration_number' => ['string'],
            'odometer_reading' => ['string'],
            'date_of_purchase' => ['date'],
            'engine_number' => ['string'],
            'chasis_number' => ['string'],
            'last_servicing_date' => ['date'],
            'servicing_count' => ['integer'],
            'warranty_status' => ['string'],
            'source' => ['required', 'string'],
            'remarks' => ['string'],
        ]);
        if ($validationState->fails()) {
            return Response::withBadRequest("Ticket" . Message::$validationFailed, $validationState->errors());
        }
        $validatedData = $validationState->validated();
        $tickets = DB::table('tickets')->where('id', $validatedData['id'])->whereNotNull('deleted_at')->first();
        if ($tickets) {
            return Response::withBadRequest("Ticket" . Message::$updateFailed);
        }
        Tracelogs::AddTraceLogs(
            'ticket',
            'update',
            'tickets',
            $validatedData['id'],
            Ticket::find($validatedData['id']),
            null,
        );
        $check = DB::table('customer_profiles')->where('customer_phone', $validatedData['customer_phone'])->whereNull('deleted_at')->exists();
        if ($check) {
            DB::table('customer_profiles')->where('customer_phone', $validatedData['customer_phone'])->update([
                'customer_name' => $validatedData['customer_name'],
                'alternate_number' => $validatedData['alternate_number'],
                'address' => $validatedData['address'],
                'registered_phone_number' => $validatedData['registered_phone_number'],
            ]);
        }
        $tickets = DB::table('tickets')->where('id', $validatedData['id'])->update([
            'call_type_id' => $validatedData['call_type_id'],
            'call_category_id' => $validatedData['call_category_id'],
            'call_sub_category_id' => $validatedData['call_sub_category_id'],
            'product_id' => $validatedData['product_id'],
            'product_model_id' => $validatedData['product_model_id'],
            'product_model_variant_id' => $validatedData['product_model_variant_id'],
            'department_id' => $validatedData['department_id'],
            // 'customer_name' => $validatedData['customer_name'],
            // 'customer_phone' => $validatedData['customer_phone'],
            // 'address' => $validatedData['address'],
            // 'alternate_number' => $validatedData['alternate_number'],
            // 'registered_phone_number' => $validatedData['registered_phone_number'],
            'description'=>Events::$events['ticket'].': '.$validatedData['id'].Events::$event_names['update'].' '. ' by '.Auth::id(),
            'vehicle_registration_number' => $validatedData['vehicle_registration_number'],
            'odometer_reading' => $validatedData['odometer_reading'],
            'date_of_purchase' => $validatedData['date_of_purchase'],
            'engine_number' => $validatedData['engine_number'],
            'chasis_number' => $validatedData['chasis_number'],
            'last_servicing_date' => $validatedData['last_servicing_date'],
            'servicing_count' => $validatedData['servicing_count'],
            'warranty_status' => $validatedData['warranty_status'],
            'source' => $validatedData['source'],
            'remarks' => $validatedData['remarks'],
            'updated_at' => now()
        ]);
        if ($tickets) {
            return Response::withCreated("Ticket" . Message::$updateSuccess, $validatedData);
        }
        return Response::withBadRequest("Ticket" . Message::$updateFailed);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['ticket']['delete'] . ' ticket');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Ticket id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'ticket',
            'delete',
            'tickets',
            $id,
            Ticket::find($id),
            null,
        );
        $status = DB::table('tickets')->where('id', $id)->whereNull('deleted_at')->update(['deleted_at' => now()]);
        if ($status) {
            return Response::withOk("Ticket" . Message::$delSuccess, $status);
        }
        return Response::withBadRequest("Ticket" . Message::$delFailed);
    }


    /**
     * Restore the removed specified resource from storage.
     */
    public function restore(string $id)
    {
        $checkPerm = User::find(Auth::id())->hasPermissionTo(Permissions::$permissions['ticket']['restore'] . ' ticket');
        if (!$checkPerm) {
            return Response::withForbidden("User" . Message::$forbidden);
        }
        if (!is_numeric($id) || $id === null) {
            return Response::withBadRequest("Ticket id" . Message::$invalid);
        }
        Tracelogs::AddTraceLogs(
            'ticket',
            'restore',
            'tickets',
            $id,
            null,
            null,
        );
        $status = DB::table('tickets')->where('id', $id)->whereNotNull('deleted_at')->update(['deleted_at' => Null]);
        if ($status) {
            return Response::withOk("Ticket" . Message::$restoreSuccess, $status);
        }
        return Response::withBadRequest("Ticket" . Message::$restoreFailed);
    }

    /**
     * Solves the specified resource from storage.
     */
    public function solveTicket(string $id)
    {
        $user = User::find(Auth::id());
        $checkPerm = $user->hasPermissionTo(Permissions::$permissions['ticket']['solve'] . ' ticket');
        if (!$checkPerm) {
            return Response::withForbidden("Ticket Solve" . Message::$forbidden, $checkPerm);
        }
        $checkTicketValidity = DB::table('tickets')->where('id', $id)->where('status', 'Close')->whereNull('deleted_at')->exists();
        if ($checkTicketValidity) {
            return Response::withNotFound("Ticket id" . Message::$invalid, $checkTicketValidity);
        }
        $checkTicket = DB::table('tickets')
            ->where('id', $id)
            ->whereNull('deleted_at')
            ->where(function ($query) use ($user) {
                $query->where(function ($q) use ($user) {
                    $q->where('department_id', $user->department_id)
                        ->where('opened_by_user_id', $user->id)
                        ->whereNull('forwarded_to_department_id');
                })->orWhere(function ($q) use ($user) {
                    $q->where('forwarded_to_department_id', $user->department_id)
                        ->where('opened_by_user_id', $user->id);
                });
            })
            ->exists();

        if (!$checkTicket) {
            return Response::withForbidden("User not authorized to solve ticket");
        }

        $validationState = Validator::make(request()->all(), [
            'remarks' => ['required', 'string'],
        ]);
        if ($validationState->fails()) {
            return Response::withBadRequest("Ticket" . Message::$validationFailed, $validationState->errors());
        }
        $validatedData = $validationState->validated();
        $remarks = DB::table('ticket_has_remarks')->insert([
            'user_id' => Auth::id(),
            'ticket_id' => $id,
            'remarks' => $validatedData['remarks'],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
            'updated_at' => now()
        ]);
        $update_ticket = DB::table('tickets')->where('id', $id)->update([
            'status' => TicketStatus::$statuses['cl'],
            'remarks' => $validatedData['remarks'],
            'solved_time' => now(),
            'updated_at' => now()
        ]);
        Tracelogs::AddTraceLogs(
            'ticket',
            'forward',
            'tickets',
            $id,
            Ticket::find($id),
            null,
        );

        if ($remarks && $update_ticket) {
            return Response::withOk("Ticket solve" . Message::$updateSuccess, $remarks);
        }

        return Response::withBadRequest("Ticket solve" . Message::$updateFailed);
    }
    /**
     * Forwards the specified resource from storage.
     */
    public function forwardTicket(string $id)
    {
        $user = User::find(Auth::id());
        $checkPerm = $user->hasPermissionTo(Permissions::$permissions['ticket']['forward'] . ' ticket');
        if (!$checkPerm) {
            return Response::withForbidden("Ticket Remarks" . Message::$forbidden, $checkPerm);
        }
        $checkForwarded = DB::table('tickets')->where('id', $id)->where('forwarded_to_department_id', $user->department_id)->exists();
        $checkOpened = DB::table('tickets')->where('id', $id)->where('opened_by_user_id', $user->id)->whereNull('deleted_at')->exists();
        $checkSolvedStatus = DB::table('tickets')->where('id', $id)->whereNull('deleted_at')->whereNotNull('solved_time')->exists();
        $checkDept = DB::table('tickets')->whereNull('department_opened_time')->exists();
        if (!$checkOpened && !$checkForwarded) {
            return Response::withForbidden("User not authorized to forward ticket");
        }
        $validationState = Validator::make(request()->all(), [
            'forwarded_to_department_id' => ['required', 'integer', 'exists:departments,id'],
            'remarks' => ['required', 'string'],
        ]);

        if ($validationState->fails()) {
            return Response::withBadRequest("Ticket" . Message::$validationFailed, $validationState->errors());
        }
        $validatedData = $validationState->validated();
        if ($checkDept && !$checkForwarded) {
            return Response::withForbidden("User not authorized to forward ticket");
        }
        $tickets = TicketReport::find(['id' => $id]);
        if (!$tickets) {
            return Response::withBadRequest("Ticket Remarks" . Message::$updateFailed);
        }
        $remarks = DB::table('ticket_has_remarks')->insert([
            'user_id' => Auth::id(),
            'ticket_id' => $id,
            'remarks' => $validatedData['remarks'],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
            'updated_at' => now()
        ]);
        $update_ticket = DB::table('tickets')->where('id', $id)->update([
            'forwarded_to_department_id' => $validatedData['forwarded_to_department_id'],
            'remarks' => $validatedData['remarks'],
            'department_opened_time' => null,
            'updated_at' => now()
        ]);

        Tracelogs::AddTraceLogs(
            'ticket',
            'forward',
            'tickets',
            $id,
            Ticket::find($id),
            null,
        );
        TicketForwardlogs::AddForwardLogs($validatedData['forwarded_to_department_id'], $id);
        if ($checkSolvedStatus) {
            DB::table('tickets')->where('id', $id)->update([
                'solved_time' => null,
                'updated_at' => now()
            ]);
        }
        if ($remarks && $update_ticket) {
            return Response::withOk("Ticket forwarding" . Message::$updateSuccess, $remarks);
        }

        return Response::withBadRequest("Ticket forwarding" . Message::$updateFailed);
    }
    /**
     * Remarks the specified resource from storage.
     */
    public function giveRemarks(Request $request, $id)
    {
        $user = User::find(Auth::id());
        $checkPerm = $user->hasPermissionTo(Permissions::$permissions['ticket']['remarks'] . ' ticket');
        if (!$checkPerm) {
            return Response::withForbidden("Ticket Remarks" . Message::$forbidden, $checkPerm);
        }
        $validationState = Validator::make($request->all(), [
            'remarks' => ['required', 'string']
        ]);
        if ($validationState->fails()) {
            return Response::withBadRequest("Ticket" . Message::$validationFailed, $validationState->errors());
        }
        $validatedData = $validationState->validated();

        $tickets = TicketReport::find(['id' => $id]);
        if (!$tickets) {
            return Response::withBadRequest("Ticket Remarks" . Message::$updateFailed);
        }
        $checkDept = DB::table('tickets')->where('id', $id)->where('department_id', $user->department_id)->whereNull('deleted_at')->exists();
        $checkForwardedDept = DB::table('tickets')->where('id', $id)->where('forwarded_to_department_id', $user->department_id)->whereNull('deleted_at')->exists();
        if ($checkDept || $checkForwardedDept) {
            $remarks = DB::table('ticket_has_remarks')->insertGetId([
                'user_id' => $user->id,
                'ticket_id' => $id,
                'remarks' => $validatedData['remarks'],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
            $ticket = TicketReport::find(['id' => $remarks]);
            if ($ticket) {
                return Response::withOk("Ticket Remarks" . Message::$updateSuccess);
            }
        }
        return Response::withBadRequest("Ticket Remarks" . Message::$updateFailed);
    }
}

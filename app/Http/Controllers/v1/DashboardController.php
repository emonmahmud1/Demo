<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\Permissions;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DashboardController extends Controller
{
    private function formatTime($seconds)
    {
        $days = floor($seconds / (24 * 60 * 60));
        $seconds -= $days * 24 * 60 * 60;

        $hours = floor($seconds / (60 * 60));
        $seconds -= $hours * 60 * 60;

        $minutes = floor($seconds / 60);
        $seconds = $seconds % 60;

        return sprintf('%d days %02d:%02d:%02d', $days, $hours, $minutes, $seconds);
    }
    // Helper function to generate date range between start and end dates
    private function generateDateRange($startDate, $endDate)
    {
        $dates = collect();
        $currentDate = Carbon::parse($startDate);

        while ($currentDate->lte(Carbon::parse($endDate))) {
            $dates->push($currentDate->toDateString());
            $currentDate->addDay();
        }
        return $dates;
    }
    /**
     * Display a listing of the resource.
     */
    public function getTicketQuery(Request $request)
    {
        $user = User::find(Auth::id());
        $checkPerm = $user->hasPermissionTo(Permissions::$permissions['dashboard']['read'] . ' dashboard');
        if (!$checkPerm) {
            return Response::withForbidden("Dashboard " . Message::$forbidden, $checkPerm);
        }
        $validationState = Validator::make($request->all(), [
            'start_date' => ['required', 'date'],
            'end_date' => [
                'required',
                'date',
                'after_or_equal:start_date',
                function ($attribute, $value, $fail) use ($request) {
                    $startDate = strtotime($request->input('start_date'));
                    $endDate = strtotime($value);
                    $difference = abs($endDate - $startDate);
                    $sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60;

                    if ($difference > $sixMonthsInSeconds) {
                        $fail("The difference between {$attribute} and start_date must be less than or equal to 6 months.");
                    }
                },
            ]
        ]);
        if ($validationState->fails()) {
            return Response::withBadRequest("Tickets" . Message::$validationFailed, $validationState->errors());
        }

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $dates = $this->generateDateRange($startDate, $endDate);
        $tickets = DB::table('tickets')
            ->join('call_types', 'tickets.call_type_id', '=', 'call_types.id')
            ->selectRaw('DATE(tickets.created_at) as date, count(*) as count')
            ->whereDate('tickets.created_at', '>=', $startDate)
            ->whereDate('tickets.created_at', '<=', $endDate)
            ->where('call_types.name', '=', 'Query')
            ->groupBy(DB::raw('DATE(tickets.created_at)'))
            ->orderBy('date', 'desc')
            ->get()
            ->keyBy('date');

        $result = $dates->map(function ($date) use ($tickets) {
            return [
                'date' => $date,
                'count' => $tickets->get($date)->count ?? 0
            ];
        });
        if ($result->isEmpty()) {
            return Response::withNotFound("No tickets found");
        }
        return Response::withOk("Ticket count for Query", $result);
    }



    /**
     * Display a listing of the resource.
     */
    public function getTicketComplaint(Request $request)
    {
        $user = User::find(Auth::id());
        $checkPerm = $user->hasPermissionTo(Permissions::$permissions['dashboard']['read'] . ' dashboard');
        if (!$checkPerm) {
            return Response::withForbidden("Dashboard " . Message::$forbidden, $checkPerm);
        }
        $validationState = Validator::make($request->all(), [
            'start_date' => ['required', 'date'],
            'end_date' => [
                'required',
                'date',
                'after_or_equal:start_date',
                function ($attribute, $value, $fail) use ($request) {
                    $startDate = strtotime($request->input('start_date'));
                    $endDate = strtotime($value);
                    $difference = abs($endDate - $startDate);
                    $sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60;

                    if ($difference > $sixMonthsInSeconds) {
                        $fail("The difference between {$attribute} and start_date must be less than or equal to 6 months.");
                    }
                },
            ]
        ]);
        if ($validationState->fails()) {
            return Response::withBadRequest("Tickets" . Message::$validationFailed, $validationState->errors());
        }

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $dates = $this->generateDateRange($startDate, $endDate);
        $tickets = DB::table('tickets')
            ->join('call_types', 'tickets.call_type_id', '=', 'call_types.id')
            ->selectRaw('DATE(tickets.created_at) as date, count(*) as count')
            ->whereDate('tickets.created_at', '>=', $startDate)
            ->whereDate('tickets.created_at', '<=', $endDate)
            ->where('call_types.name', '=', 'Complaint')
            ->groupBy(DB::raw('DATE(tickets.created_at)'))
            ->orderBy('date', 'desc')
            ->get()
            ->keyBy('date');

        $result = $dates->map(function ($date) use ($tickets) {
            return [
                'date' => $date,
                'count' => $tickets->get($date)->count ?? 0
            ];
        });
        if ($result->isEmpty()) {
            return Response::withNotFound("No tickets found");
        }

        return Response::withOk("Ticket count for Complaint", $result);
    }

    /**
     * Display a listing of the resource.
     */
    public function getTicketCftr(Request $request)
    {
        $user = User::find(Auth::id());
        $checkPerm = $user->hasPermissionTo(Permissions::$permissions['dashboard']['read'] . ' dashboard');
        if (!$checkPerm) {
            return Response::withForbidden("Dashboard " . Message::$forbidden, $checkPerm);
        }
        $validationState = Validator::make($request->all(), [
            'start_date' => [
                'required',
                'date'
            ],
            'end_date' => [
                'required',
                'date',
                'after_or_equal:start_date',
                function ($attribute, $value, $fail) use ($request) {
                    $startDate = strtotime($request->input('start_date'));
                    $endDate = strtotime($value);
                    $difference = abs($endDate - $startDate);
                    $sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60;

                    if ($difference > $sixMonthsInSeconds) {
                        $fail("The difference between {$attribute} and start_date must be less than or equal to 6 months.");
                    }
                },
            ]
        ]);
        if ($validationState->fails()) {
            return Response::withBadRequest("Tickets" . Message::$validationFailed, $validationState->errors());
        }
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $dates = $this->generateDateRange($startDate, $endDate);
        $tickets = DB::table('tickets')
            ->join('call_types', 'tickets.call_type_id', '=', 'call_types.id')
            ->selectRaw('DATE(tickets.created_at) as date, count(*) as count')
            ->whereDate('tickets.created_at', '>=', $startDate)
            ->whereDate('tickets.created_at', '<=', $endDate)
            ->where('call_types.name', '=', 'C-FTR')
            ->groupBy(DB::raw('DATE(tickets.created_at)'))
            ->orderBy('date', 'desc')
            ->get()
            ->keyBy('date');

        $result = $dates->map(function ($date) use ($tickets) {
            return [
                'date' => $date,
                'count' => $tickets->get($date)->count ?? 0
            ];
        });
        if ($result->isEmpty()) {
            return Response::withNotFound("No tickets found");
        }

        return Response::withOk("Ticket count for C-FTR", $result);
    }
    public function getSixMonthsSource()
    {
        $user = User::find(Auth::id());
        $checkPerm = $user->hasPermissionTo(Permissions::$permissions['dashboard']['read'] . ' dashboard');
        if (!$checkPerm) {
            return Response::withForbidden("Dashboard " . Message::$forbidden, $checkPerm);
        }
        $now = Carbon::now();
        $sixMonthsAgo = $now->subMonths(6);

        $sourceCounts = DB::table('tickets')
            ->select('source', DB::raw('count(*) as count'))
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupBy('source')
            ->get();

        $totalRecords = $sourceCounts->sum('count');

        $sourcePercentages = $sourceCounts->map(function ($source) use ($totalRecords) {
            $source->percentage = round(($source->count / $totalRecords) * 100, 2);
            $source->total = $totalRecords;
            return $source;
        });

        return Response::withOk('Last 6 months ticket source' . Message::$fetchSuccess, $sourcePercentages);
    }
    public function getTopTicketCount(Request $request)
    {
        $user = User::find(Auth::id());
        $checkPerm = $user->hasPermissionTo(Permissions::$permissions['dashboard']['read'] . ' dashboard');
        if (!$checkPerm) {
            return Response::withForbidden("Dashboard " . Message::$forbidden, $checkPerm);
        }
        $validationState = Validator::make($request->all(), [
            'start_date' => [
                'required',
                'date'
            ],
            'end_date' => [
                'required',
                'date',
                'after_or_equal:start_date',
                function ($attribute, $value, $fail) use ($request) {
                    $startDate = strtotime($request->input('start_date'));
                    $endDate = strtotime($value);
                    $difference = abs($endDate - $startDate);
                    $sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60;

                    if ($difference > $sixMonthsInSeconds) {
                        $fail("The difference between {$attribute} and start_date must be less than or equal to 6 months.");
                    }
                },
            ]
        ]);
        if ($validationState->fails()) {
            return Response::withBadRequest("Tickets" . Message::$validationFailed, $validationState->errors());
        }
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $ticketcounts = DB::table('tickets')
            ->leftJoin('call_categories', 'tickets.call_category_id', '=', 'call_categories.id')
            ->selectRaw('call_categories.name as category_name, COUNT(tickets.id) as ticket_count')
            ->whereDate('tickets.created_at', '>=', $startDate)
            ->whereDate('tickets.created_at', '<=', $endDate)
            ->groupBy('call_categories.name')
            ->orderBy('ticket_count', 'desc')
            ->limit(7)
            ->get();

        if (count($ticketcounts) > 0) {
            return Response::withOk("Top 7 category tickets" . Message::$fetchSuccess, $ticketcounts);
        }
        return Response::withBadRequest("Top 7 category tickets" . Message::$fetchFailed, $ticketcounts);
    }


    public function getTopTenSolvedTime(Request $request)
    {
        $user = User::find(Auth::id());
        $checkPerm = $user->hasPermissionTo(Permissions::$permissions['dashboard']['read'] . ' dashboard');
        if (!$checkPerm) {
            return Response::withForbidden("Dashboard " . Message::$forbidden, $checkPerm);
        }
        $validationState = Validator::make($request->all(), [
            'start_date' => [
                'required',
                'date'
            ],
            'end_date' => [
                'required',
                'date',
                'after_or_equal:start_date',
                function ($attribute, $value, $fail) use ($request) {
                    $startDate = strtotime($request->input('start_date'));
                    $endDate = strtotime($value);
                    $difference = abs($endDate - $startDate);
                    $sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60;

                    if ($difference > $sixMonthsInSeconds) {
                        $fail("The difference between {$attribute} and start_date must be less than or equal to 6 months.");
                    }
                },
            ]
        ]);
        if ($validationState->fails()) {
            return Response::withBadRequest("Tickets" . Message::$validationFailed, $validationState->errors());
        }
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $ticketTimes = DB::table('tickets')
            ->leftJoin('call_categories', 'tickets.call_category_id', '=', 'call_categories.id')
            ->select('call_categories.name as call_category_name', DB::raw('AVG(TIMESTAMPDIFF(SECOND, tickets.created_at, tickets.solved_time)) as average_time'))
            ->whereDate('tickets.created_at', '>=', $startDate)
            ->whereDate('tickets.created_at', '<=', $endDate)
            ->whereNotNull('tickets.solved_time')
            ->whereNotNull('tickets.created_at')
            ->groupBy('call_categories.name')
            ->orderByDesc('average_time')
            ->take(7)
            ->get();

        // $result = $ticketTimes->map(function ($ticket) {
        //     // $formattedTime = $this->formatTime($ticket->average_resolution_time);
        //     $formattedTime=$this->formatTime($ticket->average_time);
        //     return [
        //         'call_category_name' => $ticket->call_category_name,
        //         'average_solved_time' => $formattedTime,
        //     ];
        // });

        return Response::withOk("Top 7 average solved time by category", $ticketTimes);
    }
}

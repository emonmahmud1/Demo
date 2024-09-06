<?php

namespace App\Main;

use Illuminate\Database\Eloquent\Casts\Json;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/**
 * @param int $forwarded_to_department_id,
 * @param int $ticket_id
 */
class TicketForwardlogs{
    public static function AddForwardLogs( int $forwarded_to_department_id, int $ticket_id){
        DB::table('ticket_forward_logs')->insert([
            'opened_user_id'=>Auth::id(),
            'forwarded_to_department_id'=>$forwarded_to_department_id,
            'ticket_id'=>$ticket_id,
            'user_agent' => request()->header('User-Agent'),    
            'ip_address' => request()->ip(),
            'created_at'=>now()
        ]);
    }
}

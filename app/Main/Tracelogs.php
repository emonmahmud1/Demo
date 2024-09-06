<?php

namespace App\Main;

use Illuminate\Database\Eloquent\Casts\Json;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/**
 * @param string $event,
 * @param string $event_name,
 * @param string $table_name,
 * @param int $row_id,
 * @param Model $object,
 * @param int $user_id
 */
class Tracelogs{
    public static function AddTraceLogs(string $event, string $event_name,string $table_name,int $row_id,?string $description=null, ?Model $object=null,?int $user_id=null ){
        DB::table('trace_logs')->insert([
            'user_id' => $user_id??Auth::id(),
            'user_agent' => request()->header('User-Agent'),    
            'event_name' => Events::$events[$event] .' '. Events::$event_names[$event_name],
            'table_name' => $table_name,
            'description'=>$description,
            'effected_row_id' => $row_id,
            'old_data' => $object??null,
            'created_at'=>now()
        ]);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketForwardLog extends Model
{
    use HasFactory;

    protected $fillable=[
        'opened_user_id',
        'forwarded_to_department_id',
        'ticket_id',
        'ip_address',
        'user_agent',
    ];

}

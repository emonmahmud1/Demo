<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketHasRemark extends Model
{
    use HasFactory,SoftDeletes;

    protected $dates='deleted_at';

    protected $fillable=[
        'user_id',
        'ticket_id',
        'ip_address',
        'user_agent',
        'remarks'
    ];
}

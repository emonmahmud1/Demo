<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TraceLogs extends Model
{
    use HasFactory;

    protected $fillable=[
        'event_name',
        'table_name',
        'user_id',
        'user_agent',
        'effected_row_id',
        'old_data',
        'description'
    ];

    protected $casts=[
        'old_data' => 'array',
    ];
}

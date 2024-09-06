<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CallType extends Model
{
    use HasFactory, SoftDeletes;

    protected $dates=['deleted_at'];

    protected $fillable=[
        'name',
        'name_bn',
        'status'
    ];
}

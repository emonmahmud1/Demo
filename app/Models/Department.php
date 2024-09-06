<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory,SoftDeletes;

    protected $dates=['deleted_at'];

    protected $casts=[
        'to_list'=>'array',
        'cc'=>'array',
        'bcc'=>'array'
    ];

    protected $fillable=[
        'name',
        'to_list',
        'cc',
        'bcc'
    ];
}

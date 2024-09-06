<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CallSubCategory extends Model
{
    use HasFactory,SoftDeletes;

    protected $dates=['deleted_at'];

    protected $casts=[
        'to_list'=>'array',
        'cc'=>'array',
        'bcc'=>'array'
    ];

    protected $fillable=[
        'call_type_id',
        'call_category_id',
        'department_id',
        's_m_t_p_id',
        'name',
        'name_bn',
        'status',
        'to_list',
        'cc',
        'bcc'

    ];
}

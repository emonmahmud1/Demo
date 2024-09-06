<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerProfile extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable=[
        'customer_name',
        'customer_phone',
        'alternate_number',
        'address',
        'registered_phone_number'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Events\Dispatchable;

class Ticket extends Model
{
    use HasFactory,SoftDeletes,Dispatchable;

    protected $dates=['deleted_at','solved_time','opened_time','dispatched_time'];

    protected $fillable=[
        'tracking_id',
        'call_type_id',
        'call_category_id',
        'call_sub_category_id',
        'product_id',
        'product_model_id',
        'product_model_variant_id',
        'department_id',
        'forwarded_to_department_id',
        'opened_user_id',
        // 'customer_name',
        'customer_phone',
        // 'althernate_number',
        // 'address',
        // 'resgistered_phone_number',
        'vehicle_registration_number',
        'odometer_reading',
        'date_of_purchase',
        'engine_number',
        'chasis_number',
        'last_servicing_date',
        'servicing_count',
        'warranty_status',
        'source',
        'remarks',
        'solved_time',
        'department_opened_time',
        'status'

    ];

}

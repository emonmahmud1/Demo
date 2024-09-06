<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductModelVariant extends Model
{
    use HasFactory,SoftDeletes;

    protected $dates=['deleted_at'];

    protected $fillable=[
        'product_id',
        'product_model_id',
        'name'
    ];
}

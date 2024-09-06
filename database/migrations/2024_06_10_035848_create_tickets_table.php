<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_id')->unique();
            $table->unsignedBigInteger('call_type_id');
            $table->unsignedBigInteger('call_category_id');
            $table->unsignedBigInteger('call_sub_category_id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('product_model_id');
            $table->unsignedBigInteger('product_model_variant_id');
            $table->unsignedBigInteger('customer_profile_id');
            $table->unsignedBigInteger('department_id');
            $table->unsignedBigInteger('forwarded_to_department_id')->nullable();
            $table->unsignedBigInteger('opened_by_user_id')->nullable();
            // $table->string('customer_name');
            $table->string('customer_phone');
            // $table->string('alternate_number');
            // $table->string('address');
            // $table->string('registered_phone_number');
            $table->string('vehicle_registration_number');
            $table->string('odometer_reading');
            $table->date('date_of_purchase');
            $table->string('engine_number');
            $table->string('chasis_number');
            $table->date('last_servicing_date');
            $table->integer('servicing_count');
            $table->string('warranty_status');
            $table->string('remarks');
            $table->string('source');
            $table->string('status')->nullable();
            $table->foreign('customer_profile_id')
                ->references('id')
                ->on('customer_profiles');
            $table->foreign('call_type_id')
                ->references('id')
                ->on('call_types');
            $table->foreign('call_category_id')
                ->references('id')
                ->on('call_categories');
            $table->foreign('call_sub_category_id')
                ->references('id')
                ->on('call_sub_categories');
            $table->foreign('product_id')
                ->references('id')
                ->on('products');
            $table->foreign('product_model_id')
                ->references('id')
                ->on('product_models');
            $table->foreign('product_model_variant_id')
                ->references('id')
                ->on('product_model_variants');
            $table->foreign('department_id')
                ->references('id')
                ->on('departments');
            $table->foreign('opened_by_user_id')
                ->references('id')
                ->on('users');
            $table->foreign('forwarded_to_department_id')
                ->references('id')
                ->on('departments');
            $table->timestamp('solved_time')->nullable();
            $table->timestamp('department_opened_time')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};

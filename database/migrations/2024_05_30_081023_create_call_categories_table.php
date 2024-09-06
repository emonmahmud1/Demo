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
        Schema::create('call_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('call_type_id');
            $table->string('name');
            $table->string('name_bn');
            $table->string('status')->default('active');
            $table->foreign('call_type_id')
                ->references('id')
                ->on('call_types');
            $table->softDeletes();
            $table->timestamps();
        });

        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('call_categories');

    }
};

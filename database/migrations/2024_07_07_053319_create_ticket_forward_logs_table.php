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
        Schema::create('ticket_forward_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('opened_user_id');
            $table->unsignedBigInteger('forwarded_to_department_id');
            $table->unsignedBigInteger('ticket_id');
            $table->string('ip_address');
            $table->string('user_agent');
            $table->foreign('opened_user_id')
                ->references('id')
                ->on('users');
            $table->foreign('forwarded_to_department_id')
                ->references('id')
                ->on('departments');
            $table->foreign('ticket_id')
                ->references('id')
                ->on('tickets');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_forward_logs');
    }
};

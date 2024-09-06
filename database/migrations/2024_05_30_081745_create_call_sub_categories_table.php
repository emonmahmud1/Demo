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
        Schema::create('s_m_t_p_s', function (Blueprint $table) {
            $table->id();
            $table->string('mail_mailer');
            $table->string('mail_host');
            $table->string('mail_port');
            $table->string('mail_username');
            $table->string('mail_password');
            $table->string('mail_encryption');
            $table->string('mail_from_address');
            $table->string('mail_from_name');
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::create('call_sub_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('call_type_id');
            $table->unsignedBigInteger('call_category_id');
            $table->unsignedBigInteger('department_id');
            $table->unsignedBigInteger('s_m_t_p_id');
            $table->string('name');
            $table->string('name_bn');
            $table->string('status')->default('active');
            $table->json('to_list')->nullable();
            $table->json('cc')->nullable();
            $table->json('bcc')->nullable();
            $table->foreign('call_type_id')
                ->references('id')
                ->on('call_types');
            $table->foreign('call_category_id')
                ->references('id')
                ->on('call_categories');
            $table->foreign('department_id')
                ->references('id')
                ->on('departments');
            $table->foreign('s_m_t_p_id')
                ->references('id')
                ->on('s_m_t_p_s');
            $table->softDeletes();
            $table->timestamps();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('s_m_t_p_s');

        Schema::dropIfExists('call_sub_categories');
    }
};

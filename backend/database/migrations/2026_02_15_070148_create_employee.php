<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('Employee')) {
            Schema::create('Employee', function (Blueprint $table) {
                $table->id();
                $table->string('username')->unique();
                $table->string('password');
                $table->string('email')->unique();
                $table->string('contact_number');
                $table->date('hire_date');
                $table->decimal('monthly_salary')->unsigned();
                $table->enum('role', ['Manager', 'Employee']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('Employee');
    }
};

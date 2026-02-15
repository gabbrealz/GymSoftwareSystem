<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('WorkoutSession')) {
            Schema::create('WorkoutSession', function (Blueprint $table) {
                $table->id();
                $table->timestamp('date_time_in');
                $table->timestamp('date_time_out');
                $table->foreignId('customer_id')->constrained('Customer');
                $table->decimal('payment_amount')->unsigned();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('WorkoutSession');
    }
};

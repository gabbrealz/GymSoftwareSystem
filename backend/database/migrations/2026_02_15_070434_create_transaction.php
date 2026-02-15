<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('Transaction')) {
            Schema::create('Transaction', function (Blueprint $table) {
                $table->id();
                $table->timestamp('date_time');
                $table->string('mode_of_payment')->default('Cash');
                $table->string('reference_number');
                $table->string('status');
                $table->foreignId('recorded_by')->nullable()->constrained('Employee');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('Transaction');
    }
};

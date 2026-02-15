<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('CourtBookings')) {
            Schema::create('CourtBookings', function (Blueprint $table) {
                $table->id();
                $table->timestamp('reserve_date_time');
                $table->timestamp('reserve_date_end');
                $table->text('contact_person');
                $table->decimal('contact_number'); 
                $table->enum('status', ['Pending', 'On Going', 'Finished', 'Cancelled']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('CourtBookings');
    }
};

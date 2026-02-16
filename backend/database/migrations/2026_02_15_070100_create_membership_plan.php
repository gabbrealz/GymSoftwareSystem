<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('MembershipPlan')) {
            Schema::create('MembershipPlan', function (Blueprint $table) {
                $table->id();
                $table->string('type');
                $table->decimal('rate');
                $table->text('description');
                $table->decimal('session_rate');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('MembershipPlan');
    }
};

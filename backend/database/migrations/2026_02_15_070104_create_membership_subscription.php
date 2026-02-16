<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('MembershipSubscription')) {
            Schema::create('MembershipSubscription', function (Blueprint $table) {
                $table->id();
                $table->timestamp('date_time_start');
                $table->timestamp('date_time_out');
                $table->foreignId('plan_id')->constrained('MembershipPlan');
                $table->foreignId('member_id')->constrained('MemberList');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('MembershipSubscription');
    }
};

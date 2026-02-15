<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('Customer')) {
            Schema::create('Customer', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->timestamp('created_at');
                $table->foreignId('member_id')->nullable()->unique()->constrained('MemberList');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('Customer');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('MemberList')) {
            Schema::create('MemberList', function (Blueprint $table) {
                $table->id();
                $table->string('contact_number');
                $table->string('email')->unique();
                $table->text('address');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('MemberList');
    }
};

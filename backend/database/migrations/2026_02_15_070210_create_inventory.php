<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('Inventory')) {
            Schema::create('Inventory', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->decimal('price');
                $table->string('sku');
                $table->decimal('stock')->nullable();
                $table->date('last_stocked')->nullable();
                $table->foreignId('stocked_by')->nullable()->constrained('Employee');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('Inventory');
    }
};

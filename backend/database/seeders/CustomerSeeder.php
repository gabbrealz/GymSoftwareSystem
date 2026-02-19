<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $janCount = 60;
        $febCount = 40;

        $current = now()->startOfYear();
        $endOfJanRange = now()->startOfYear()->addMonth();

        for ($i = 0; $i < $janCount && $current < $endOfJanRange; $i++) {
            $current = $current->addHours(rand(4, 16));

            if (rand(1, 10) <= 5)
                Customer::factory()->create(['created_at' => $current->copy()]);
            else
                Customer::factory()->asMember()->create(['created_at' => $current->copy()]);
        }

        $current = now()->startOfYear()->addMonth();
        $endOfFebRange = now();

        for ($i = 0; $i < $febCount && $current < $endOfFebRange; $i++) {
            $current = $current->addHours(rand(4, 16));
            if ($current > $endOfFebRange) break;
            
            if (rand(1, 10) <= 5)
                Customer::factory()->create(['created_at' => $current->copy()]);
            else
                Customer::factory()->asMember()->create(['created_at' => $current->copy()]);
        }
    }
}

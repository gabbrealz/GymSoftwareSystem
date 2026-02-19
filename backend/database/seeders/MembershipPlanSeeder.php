<?php

namespace Database\Seeders;

use App\Models\MembershipPlan;
use Illuminate\Database\Seeder;

class MembershipPlanSeeder extends Seeder
{
    public function run(): void
    {
        MembershipPlan::create([
            'type' => 'VIP',
            'rate' => 1000,
            'description' => 'VIP Membership Plan',
            'session_rate' => 50
        ]);

        MembershipPlan::create([
            'type' => 'Regular',
            'rate' => 800,
            'description' => 'Regular Membership Plan',
            'session_rate' => 80
        ]);
    }
}

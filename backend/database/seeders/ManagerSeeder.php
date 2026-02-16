<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Employee;
use Illuminate\Database\Seeder;

class ManagerSeeder extends Seeder
{
    public function run(): void
    {
        Employee::create([
            'username' => 'Ariana',
            'email' => 'ariana@sertfit.com',
            'password' => '1234567A',
            'contact_number' => '09123456789',
            'hire_date' => Carbon::now(),
            'monthly_salary' => 50000.00,
            'role' => 'Manager',
        ]);
    }
}

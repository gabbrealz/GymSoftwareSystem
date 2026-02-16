<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Support\Arr;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition(): array
    {
        return [
            'username' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => 'Password123',
            'contact_number' => Arr::random(['09671234567','09123456789','09671236712','09123676712']),
            'hire_date' => Carbon::now(),
            'monthly_salary' => Arr::random([15000.00, 18000.00, 20000.00, 22000.00, 25000.00, 30000.00]),
            'role' => 'Employee',
        ];
    }
}

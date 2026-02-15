<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Support\Arr;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'username' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => 'Password123',
            'contact_number' => '09135246789',
            'hire_date' => Carbon::now(),
            'monthly_salary' => Arr::random([18000.00, 20000.00, 25000.00]),
            'role' => 'Employee',
        ];
    }
}

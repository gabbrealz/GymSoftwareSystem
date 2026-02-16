<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Customer;
use App\Models\Member;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'created_at' => Carbon::now(),
            'member_id' => null
        ];
    }

    public function asMember()
    {
        return $this->afterCreating(function (Customer $customer) {
            $member = Member::create([
                'email' => Str::slug($customer->name) . '@gmail.com',
                'contact_number' => Arr::random(['09123456789','09987654321','09132465798']),
                'address' => $this->faker->address(),
                'plan_type' => Arr::random([2, 3]),
            ]);

            $customer->member_id = $member->id;
            $customer->save();
        });
    }
}

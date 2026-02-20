<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Customer;
use App\Models\Member;
use App\Models\Employee;
use App\Models\MembershipPlan;
use App\Models\MembershipSubscription;
use App\Models\WorkoutSession;
use App\Models\Transaction;

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
            $plan_ids = MembershipPlan::select('id')->get();
            if ($plan_ids->isEmpty()) return;

            $employee_ids = Employee::select('id')->get();
            if ($employee_ids->isEmpty()) return;

            $member = Member::create([
                'email' => Str::slug($customer->name) . rand(10,99) . '@gmail.com',
                'contact_number' => Arr::random(['09123456789','09987654321','09132465798']),
                'address' => $this->faker->address(),
                'plan_type' => $plan_ids->random()['id'],
            ]);

            $customer->member_id = $member->id;
            $customer->save();

            $subscription = MembershipSubscription::where('member_id', '=', $member->id)
                ->latest('date_time_start')->first();

            Transaction::create([
                'date_time' => now(),
                'paid_amount' => rand(1, 10) <= 5 ? 800 : 1000,
                'mode_of_payment' => Arr::random(['Cash', 'GCash']),
                'status' => 'Paid',
                'recorded_by' => $employee_ids->random()['id'],
                'session_id' => null,
                'subscription_id' => $subscription->id,
            ]);
        });
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Customer $customer) {
            $employee_ids = Employee::select('id')->get();
            if ($employee_ids->isEmpty()) return;

            $session = WorkoutSession::where('customer_id', '=', $customer->id, 'and', 'date_time_in', '=', $customer->created_at)
                ->first();

            Transaction::create([
                'date_time' => now(),
                'paid_amount' => rand(1, 10) <= 3 ? 100 : (rand(1, 10) <= 5 ? 80 : 50),
                'mode_of_payment' => Arr::random(['Cash', 'GCash']),
                'status' => 'Paid',
                'recorded_by' => $employee_ids->random()['id'],
                'session_id' => $session->id,
                'subscription_id' => null,
            ]);
        });
    }
}

<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Models\Customer;
use App\Models\Member;
use App\Models\MembershipPlan;
use App\Models\MembershipSubscription;
use App\Models\Transaction;
use Illuminate\Validation\ValidationException;

class MemberController extends Controller
{
    public function get_members() {
        try {
            return response()->json(Cache::remember('members', 600, fn() =>
                DB::select("
                    SELECT
                        m.id, c.name, m.email, m.address,
                        m.contact_number,
                        p.type AS plan_type,
                        s.date_time_start AS join_date,
                        s.date_time_out AS expiry_date
                    FROM \"Customer\" c
                    JOIN \"MemberList\" m ON c.member_id = m.id
                    LEFT JOIN \"MembershipPlan\" p ON m.plan_type = p.id
                    LEFT JOIN \"MembershipSubscription\" s ON s.member_id = m.id
                ")
            ));
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function create_member(Request $request) {
        try {
            $data = $request->validate([
                'name' => 'bail|required|max:255|regex:/^\w+(\s\w+)*$/i',
                'email' => 'bail|required|email|unique:MemberList',
                'address' => 'bail|required|max:255|regex:/^[0-9a-zÀ-ÿ.,#\'\/\-]+(?:\s[0-9a-zÀ-ÿ.,#\'\/\-]+)*$/i',
                'contact_number' => 'bail|required|regex:/^09\d{9}$/',
                'plan_type' => 'bail|required|in:Regular,VIP',
                'payment_amount' => 'bail|required|numeric|gte:0',
                'mode_of_payment' => 'bail|required|in:Cash,GCash',
                'payment_status' => 'bail|required|in:Pending,Paid,Failed',
            ]);

            $new_member = DB::transaction(function () use ($data) {

                $membership_plans = Cache::rememberForever('membership_plans',
                    fn () => MembershipPlan::all()->keyBy('type')
                );

                $member = Member::create([
                    'contact_number' => $data['contact_number'],
                    'email' => $data['email'],
                    'address' => $data['address'],
                    'plan_type' => $membership_plans[$data['plan_type']]->id,
                ]);
                $customer = Customer::create([
                    'name' => $data['name'],
                    'member_id' => $member->id,
                    'created_at' => Carbon::now(),
                ]);
                $subscription = DB::table('MembershipSubscription')
                    ->where('member_id', '=', $member->id)
                    ->latest('date_time_start')->first();

                Transaction::create([
                    'date_time' => $customer->created_at,
                    'paid_amount' => (float) $data['payment_amount'],
                    'mode_of_payment' => $data['mode_of_payment'],
                    'status' => $data['payment_status'],
                    'recorded_by' => request()->user()->id,
                    'subscription_id' => $subscription->id,
                ]);

                $member_info = [
                    'id' => $member->id,
                    'name' => $customer->name,
                    'email' => $member->email,
                    'address' => $member->address,
                    'contact_number' => $member->contact_number,
                    'plan_type' => $data['plan_type'],
                    'join_date' => $subscription->date_time_start,
                    'expiry_date' => $subscription->date_time_out,
                ];

                return $member_info;
            });
            
            Cache::forget('members');
            return response()->json([
                'message' => 'Member created successfully',
                'new_member' => $new_member,
            ], 201);
        }
        catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);

        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function update_member(Request $request, Member $member) {
        try {
            $data = $request->validate([
                'name' => 'bail|required|max:255|regex:/^\w+(\s\w+)*$/i',
                'email' => 'bail|required|email',
                'address' => 'bail|required|max:255|regex:/^[0-9a-zÀ-ÿ.,#\'\/\-]+(?:\s[0-9a-zÀ-ÿ.,#\'\/\-]+)*$/i',
                'contact_number' => 'bail|required|regex:/^09\d{9}$/',
                'plan_type' => 'bail|required|in:Regular,VIP',
                'payment_amount' => 'bail|nullable|numeric|gte:0',
                'mode_of_payment' => 'bail|nullable|in:Cash,GCash',
                'payment_status' => 'bail|nullable|in:Pending,Paid,Failed',
            ]);

            if ($data['email'] !== $member->email && Member::where('email','=',$data['email'])->exists()) {
                throw ValidationException::withMessages([
                    'email' => ['The email is already in use.'],
                ]);
            }

            DB::transaction(function () use ($data, $member) {

                $membership_plans = Cache::rememberForever('membership_plans',
                    fn () => MembershipPlan::all()->keyBy('type')
                );

                $attributes = [
                    'contact_number' => $data['contact_number'],
                    'email' => $data['email'],
                    'address' => $data['address'],
                    'plan_type' => $membership_plans[$data['plan_type']]->id,
                ];

                Customer::where('member_id', '=', $member->id)
                    ->update(['name' => $data['name']]);

                $member->fill($attributes);
                if ($member->isDirty()) {
                    $member->save();
                    Cache::forget('members');
                }
    
                if (!empty($data['payment_amount']) && !empty($data['mode_of_payment']) && !empty($data['payment_status'])) {

                    $subscription = MembershipSubscription::create([
                        'date_time_start' => Carbon::now(),
                        'date_time_out' => Carbon::now()->addMonth(),
                        'plan_id' => $membership_plans[$data['plan_type']]->id,
                        'member_id' => $member->id,
                    ]);
                    
                    Transaction::create([
                        'date_time' => Carbon::now(),
                        'paid_amount' => (float) $data['payment_amount'],
                        'mode_of_payment' => $data['mode_of_payment'],
                        'payment_status' => $data['payment_status'],
                        'recorded_by' => request()->user()->id,
                        'subscription_id' => $subscription->id,
                    ]);
                    
                }
            });

            Cache::forget('members');
        }
        catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function delete_member(Member $member) {
        try {
            $member->delete();
            Cache::forget('members');
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
        return response()->json(['message' => 'Member deleted successfully!']);
    }

}

<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Models\Customer;
use App\Models\Member;
use App\Models\MembershipPlan;
use Illuminate\Validation\ValidationException;

class MemberController extends Controller
{
    public function get_members(Request $request) {
        try {
            return response()->json(Cache::remember('members', 600, fn() =>
                DB::select("
                    SELECT
                        m.id, c.name, m.email,
                        m.address, m.contact_number,
                        s.date_time_start AS join_date,
                        s.date_time_out AS expiry_date
                    FROM \"Customer\" c
                    JOIN \"MemberList\" m ON c.member_id = m.id
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
                'plan_type' => 'bail|required|in:Regular,VIP'
            ]);

            return DB::transaction(function () use ($data) {

                $membership_plans = Cache::rememberForever('membership_plans',
                    fn () => MembershipPlan::all()->keyBy('type')
                );

                $member = Member::create([
                    'contact_number' => $data['contact_number'],
                    'email' => $data['email'],
                    'address' => $data['address'],
                    'plan_type' => $membership_plans[$data['plan_type']],
                ]);

                Customer::create([
                    'name' => $data['name'],
                    'member_id' => $member->id,
                    'created_at' => Carbon::now(),
                ]);

                Cache::forget('members');
                return response()->json([
                    'message' => 'Member created successfully',
                ], 201);
            });

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
                'email' => 'bail|required|email|unique:MemberList',
                'address' => 'bail|required|max:255|regex:/^[0-9a-zÀ-ÿ.,#\'\/\-]+(?:\s[0-9a-zÀ-ÿ.,#\'\/\-]+)*$/i',
                'contact_number' => 'bail|required|regex:/^09\d{9}$/',
                'plan_type' => 'bail|required|in:Regular,VIP'
            ]);

            if ($data['email'] !== $member->email && Member::where('email','=',$data['email'])->exists()) {
                throw ValidationException::withMessages([
                    'email' => ['The email is already in use.'],
                ]);
            }

            $member->fill($data);
            if ($member->isDirty()) {
                $member->save();
                Cache::forget('members');
            }
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

    public function delete_member(Request $request, Member $member) {
        try {
            $member->delete();
            Cache::forget('members');
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

}

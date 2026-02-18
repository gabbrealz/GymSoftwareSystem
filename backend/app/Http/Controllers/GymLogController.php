<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use App\Models\WorkoutSession;
use App\Models\Customer;
use App\Models\Member;
use Illuminate\Validation\ValidationException;

class GymLogController extends Controller
{
    public function get_logs() {
        try {
            return response()->json(Cache::remember('gym_logs', 600, fn() =>
                DB::select("
                    SELECT
                        w.date_time_in AS date_and_time,
                        c.name,
                        CASE
                            WHEN c.member_id IS NULL THEN \"Walk-in\"
                            ELSE \"Member\"
                        END AS customer_type
                    FROM \"WorkoutSession\" w
                    JOIN \"Customer\" c ON w.customer_id = c.id
                ")
            ));
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function create_log(Request $request) {
        try {
            $data = $request->validate([
                'name' => 'bail|required|max:255|regex:/^\w+(\s\w+)*$/i',
                'email' => 'bail|nullable|email|unique:MemberList',
            ]);

            DB::transaction(function () use ($data) {
                $customer = Customer::create([
                    'name' => $data['name'],
                    'created_at' => Carbon::now(),
                    'member_id' => $data['email'] ?
                        Member::where('email', '=', $data['email'])->value('id')
                        : null
                ]);

                WorkoutSession::create([
                    'customer_id' => $customer->id,
                    'date_time_in' => $customer->created_at,
                ]);
            });

            Cache::forget('gym_logs');
            return response()->json([
                'message' => 'Workout log created successfully',
            ], 201);
        }
        catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function delete_log(Request $request, WorkoutSession $workoutSession) {
        try {
            $workoutSession->delete();
            Cache::forget('gym_logs');
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }
}
<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use App\Models\WorkoutSession;
use App\Models\Customer;
use App\Models\Member;
use App\Models\Transaction;
use Illuminate\Validation\ValidationException;

class GymLogController extends Controller
{
    public function get_logs() {
        try {
            return response()->json(Cache::remember('gym_logs', 600, fn() =>
                DB::select("
                    SELECT
                        w.id,
                        w.date_time_in AS timestamp,
                        c.name,
                        CASE
                            WHEN c.member_id IS NULL THEN 'Walk-in'
                            ELSE 'Member'
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
                'email' => 'bail|nullable|email|exists:MemberList',
                'payment_amount' => 'bail|required|numeric|gte:0',
                'mode_of_payment' => 'bail|required|in:Cash,GCash',
                'payment_status' => 'bail|required|in:Pending,Paid,Failed',
            ]);
                

            $log = DB::transaction(function () use ($data) {

                $customer = Customer::create([
                    'name' => $data['name'],
                    'created_at' => Carbon::now(),
                    'member_id' => $data['email'] !== null ?
                        Member::where('email', '=', $data['email'])->value('id') : null
                ]);

                $new_log = WorkoutSession::create([
                    'date_time_in' => $customer->created_at,
                    'customer_id' => $customer->id,
                ]);

                Transaction::create([
                    'date_time' => $customer->created_at,
                    'paid_amount' => $data['payment_amount'],
                    'mode_of_payment' => $data['mode_of_payment'],
                    'status' => $data['payment_status'],
                    'recorded_by' => request()->user()->id,
                    'session_id' => $new_log->id,
                ]);

                return [
                    'name' => $customer->name,
                    'timestamp' => $new_log->date_time_in,
                    'customer_type' => $data['email'] !== null ? 'Member' : 'Walk-in',
                ];
            });

            Cache::forget('gym_logs');
            return response()->json([
                'message' => 'Workout log created successfully',
                'new_log' => $log
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

    public function delete_log(WorkoutSession $workoutSession) {
        try {
            $workoutSession->delete();
            Cache::forget('gym_logs');
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
        return response()->json(['message' => 'Gym log deleted successfully!']);
    }
}
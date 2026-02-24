<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    public function get_transactions() {
        try {
            $transactions = DB::select("
                SELECT
                    t.id,
                    t.reference_number,
                    t.date_time,
                    t.paid_amount,
                    CASE
                        WHEN t.session_id IS NOT NULL AND t.subscription_id IS NULL THEN 'Workout Session'
                        WHEN t.session_id IS NULL AND t.subscription_id IS NOT NULL THEN 'Membership Payment'
                        WHEN t.session_id IS NOT NULL AND t.subscription_id IS NOT NULL THEN 'Error'
                        ELSE 'N/A'
                    END AS transaction_type,
                    t.mode_of_payment,
                    t.status,
                    e.username AS recorded_by
                FROM \"Transaction\" t
                LEFT JOIN \"Employee\" e ON t.recorded_by = e.id
            ");

            return response()->json($transactions, 200);
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }     
    }

    public function update_transaction(Request $request, int $transaction_id) {
        try {
            $data = $request->validate([
                'status' => 'bail|required|in:Paid,Pending,Failed'
            ]);

            Transaction::where('id', '=', $transaction_id)->update([
                'status' => $data['status'],
            ]);
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
}

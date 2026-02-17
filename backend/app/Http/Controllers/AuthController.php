<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Employee;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request) {
        try {
            $data = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);
    
            $employee = Employee::where('email', $data['email'])->first();
    
            if (!$employee || !Hash::check($data['password'], $employee->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }
    
            $token = $employee->createToken('sertfit-api-token', expiresAt: Carbon::now()->addHour())->plainTextToken;
        }
        catch (ValidationException $e) {
            return response()->json(['message' => 'Validation failed'], 422);
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }

        return response()->json(['employee' => $employee, 'token' => $token]);
    }

    public function logout(Request $request) {
        try {
            $request->user()->currentAccessToken()->delete();
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }

        return response()->json(['message' => 'Logged out successfully']);
    }
}

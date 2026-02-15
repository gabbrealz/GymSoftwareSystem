<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Employee;

class AuthController extends Controller
{
    public function login(Request $request) {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        $employee = Employee::where('email', $data['email'])->first();

        if (!$employee || !Hash::check($data['password'], $employee->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $employee->createToken('api-token')->plainTextToken;

        return response()->json(['employee' => $employee, 'token' => $token]);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}

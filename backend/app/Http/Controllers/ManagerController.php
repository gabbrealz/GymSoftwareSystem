<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use Illuminate\Validation\ValidationException;

class ManagerController extends Controller
{
    public function create_employee(Request $request) {
        try {
            $data = $request->validate([
                'username' => 'required|max:255',
                'email' => 'required|email|unique:Employee,email',
                'password' => 'required|min:8|string',
                'contact_number' => 'required',
                'hire_date' => 'required',
                'monthly_salary' => 'required',
            ]);
    
            Employee::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'contact_number' => $data['contact_number'],
                'hire_date' => $data['hire_date'],
                'monthly_salary' => $data['monthly_salary'],
                'role' => 'Employee'
            ]);

            return response()->json(['message' => 'Employee created successfully'], 201);
        }
        catch (ValidationException $e) {
            return response()->json(['message' => 'Validation failed'], 422);
        }
        catch (\Exception $e) {
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function get_employees() {
        try {
            return response()->json(Employee::all());
        }
        catch (\Exception $e) {
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }
}

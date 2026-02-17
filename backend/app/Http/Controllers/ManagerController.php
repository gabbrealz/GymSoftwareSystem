<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Employee;
use Illuminate\Validation\ValidationException;

class ManagerController extends Controller
{
    use AuthorizesRequests;

    public function create_employee(Request $request) {
        $this->authorize('create', Employee::class);

        try {
            $data = $request->validate([
                'username' => 'bail|required|alpha_num:ascii|max:255',
                'email' => 'bail|required|email|unique:Employee',
                'password' => 'bail|required|min:8|string',
                'contact_number' => 'bail|required|regex:/^09\d{9}$/',
                'hire_date' => 'bail|required|date',
                'monthly_salary' => 'bail|required|numeric|gt:0',
            ]);
    
            Employee::create([
                'username' => $data['username'],
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
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function get_employees() {
        $this->authorize('viewAny', Employee::class);

        try {
            return response()->json(Employee::all());
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function get_employee(Employee $employee) {
        $this->authorize('view', $employee);

        try {
            return response()->json($employee);
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function update_employee(Request $request, Employee $employee) {
        $this->authorize('update', $employee);

        try {
            $data = $request->validate([
                'username' => 'bail|required|alpha_num:ascii|max:255',
                'email' => 'bail|required|email',
                'password' => 'bail|required|min:8|string',
                'contact_number' => 'bail|required|regex:/^09\d{9}$/',
                'hire_date' => 'bail|required|date',
                'monthly_salary' => 'bail|required|numeric|gt:0',
            ]);

            if ($data['email'] !== $employee->email && Employee::where('email','=',$data['email'])->exists()) {
                throw ValidationException::withMessages([
                    'email' => ['The email is already in use.'],
                ]);
            }

            if (!Hash::check($data['password'], $employee->password)) {
                $employee->password = $data['password'];
            }
            unset($data['password']);

            $employee->fill($data);
            if ($employee->isDirty()) $employee->save();
        }
        catch (ValidationException $e) {
            return response()->json(['message' => 'Validation failed'], 422);
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }
}

<?php

namespace App\Policies;

use App\Models\Employee;
use Illuminate\Auth\Access\Response;

class EmployeePolicy
{
    public function viewAny(Employee $auth_employee): bool
    {
        return $auth_employee->role === 'Manager';
    }

    public function view(Employee $auth_employee, Employee $employee): bool
    {
        return $auth_employee->id === $employee->id || $auth_employee->role === 'Manager';
    }

    public function create(Employee $auth_employee): bool
    {
        return $auth_employee->role === 'Manager';
    }

    public function update(Employee $auth_employee, Employee $employee): bool
    {
        return $auth_employee->id === $employee->id || $auth_employee->role === 'Manager';
    }

    public function delete(Employee $auth_employee, Employee $employee): bool
    {
        return $auth_employee->role === 'Manager' && $employee->role !== 'Manager';
    }

    public function restore(Employee $auth_employee, Employee $employee): bool
    {
        return $auth_employee->role === 'Manager' && $employee->role !== 'Manager';
    }

    public function forceDelete(Employee $auth_employee, Employee $employee): bool
    {
        return $auth_employee->role === 'Manager' && $employee->role !== 'Manager';
    }
}

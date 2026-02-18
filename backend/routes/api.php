<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\GymLogController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function() {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/employees', [ManagerController::class, 'get_employees']);
    Route::get('/employees/{employee}', [ManagerController::class, 'get_employee']);
    Route::post('/employees', [ManagerController::class, 'create_employee']);
    Route::put('/employees/{employee}', [ManagerController::class, 'update_employee']);
    Route::delete('/employees/{employee}', [ManagerController::class, 'delete_employee']);

    Route::get('/members', [MemberController::class, 'get_members']);
    Route::post('/members', [MemberController::class, 'create_member']);
    Route::put('/members/{member}', [MemberController::class, 'update_member']);
    Route::delete('/members/{member}', [MemberController::class, 'delete_member']);

    Route::get('/workout-sessions', [GymLogController::class, 'get_logs']);
    Route::post('/workout-sessions', [GymLogController::class, 'create_log']);
    Route::delete('/workout-sessions/{workoutSession}', [GymLogController::class, 'delete_log']);
});

Route::fallback(function () {
    return response()->json([
        'message' => 'Endpoint not found.'
    ], 404);
});
<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ManagerController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function() {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/employees', [ManagerController::class, 'get_employees']);
    Route::get('/employees/{employee}', [ManagerController::class, 'get_employee']);
    Route::post('/employees', [ManagerController::class, 'create_employee']);

});
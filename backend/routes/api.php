<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ManagerController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->post('/create-employee', [ManagerController::class, 'create_employee']);

Route::middleware('auth:sanctum')->post('/get-employees', [ManagerController::class, 'get_employees']);
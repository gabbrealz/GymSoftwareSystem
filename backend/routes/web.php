<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Session\Middleware\StartSession;

Route::fallback(function () {
    return response()->json([
        'message' => 'Endpoint not found.'
    ], 404);
})->withoutMiddleware([StartSession::class]);
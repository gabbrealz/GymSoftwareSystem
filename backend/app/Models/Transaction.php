<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'Transaction';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'date_time',
        'mode_of_payment',
        'status',
        'recorded_by',
        'session_id',
        'subscription_id',
        'paid_amount',
    ];

    protected $casts = [
        'paid_amount' => 'decimal:2',
        'date_time' => 'datetime:Y-m-d H:i:s',
    ];

    public function recordedBy()
    {
        return $this->belongsTo(Employee::class, 'recorded_by', 'id');
    }
}

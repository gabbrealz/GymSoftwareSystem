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
        'reference_number',
        'status',
        'recorded_by',
    ];

    protected $casts = [
        'date_time' => 'datetime',
    ];

    public function recordedBy()
    {
        return $this->belongsTo(Employee::class, 'recorded_by', 'id');
    }
}

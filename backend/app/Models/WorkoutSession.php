<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkoutSession extends Model
{
    protected $table = 'WorkoutSession';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'date_time_in',
        'date_time_out',
        'customer_id',
        'payment_amount',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }
}

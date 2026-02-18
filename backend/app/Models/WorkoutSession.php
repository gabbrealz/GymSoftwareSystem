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
        'customer_id',
    ];

    protected $casts = [
        'date_time_in' => 'datetime:Y-m-d H:i:s',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }
}

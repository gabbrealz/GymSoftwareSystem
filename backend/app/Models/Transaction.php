<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'Transaction';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $casts = [
        'date_time' => 'datetime:Y-m-d H:m:s',
    ];

    public function recordedBy()
    {
        return $this->belongsTo(Employee::class, 'recorded_by', 'id');
    }
}

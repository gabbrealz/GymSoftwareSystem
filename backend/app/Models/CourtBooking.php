<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourtBooking extends Model
{
    protected $table = 'CourtBookings';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'reserve_date_time',
        'reserve_date_end',
        'contact_person',
        'contact_number',
        'status',
    ];
}

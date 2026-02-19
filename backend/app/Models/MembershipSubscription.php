<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MembershipSubscription extends Model
{
    protected $table = 'MembershipSubscription';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'date_time_start',
        'date_time_out',
        'plan_id',
        'member_id',
    ];

    protected $casts = [
        'date_time_start' => 'datetime:Y-m-d H:i:s',
        'date_time_out' => 'datetime H:i:s',
    ];

    public function plan()
    {
        return $this->belongsTo(MembershipPlan::class, 'plan_id', 'id');
    }

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'id');
    }
}

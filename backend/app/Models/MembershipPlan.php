<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MembershipPlan extends Model
{
    protected $table = 'MembershipPlan';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'type',
        'rate',
        'description',
        'session_rate',
    ];

    protected $casts = [
        'session_rate' => 'decimal:2',
    ];

    public function members()
    {
        return $this->hasMany(Member::class, 'plan_type', 'id');
    }

    public function subscriptions()
    {
        return $this->hasMany(MembershipSubscription::class, 'plan_id', 'id');
    }
}

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

    public function subscriptions()
    {
        return $this->hasMany(MembershipSubscription::class, 'plan_id', 'id');
    }
}

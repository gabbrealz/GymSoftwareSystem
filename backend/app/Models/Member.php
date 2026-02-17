<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Member extends Model
{
    use HasFactory;

    protected $table = 'MemberList';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'contact_number',
        'email',
        'address',
        'plan_type'
    ];

    public function customers()
    {
        return $this->hasOne(Customer::class, 'member_id', 'id');
    }

    public function plan()
    {
        return $this->belongsTo(MembershipPlan::class, 'plan_type', 'id');
    }

    public function subscriptions()
    {
        return $this->hasMany(MembershipSubscription::class, 'member_id', 'id');
    }
}

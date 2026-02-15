<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $table = 'MemberList';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'contact_number',
        'email',
        'address',
    ];

    public function customers()
    {
        return $this->hasMany(Customer::class, 'member_id', 'id');
    }

    public function subscriptions()
    {
        return $this->hasMany(MembershipSubscription::class, 'member_id', 'id');
    }
}

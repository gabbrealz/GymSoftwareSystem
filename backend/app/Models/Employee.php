<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Employee extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;

    protected $table = 'Employee';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'username',
        'email',
        'contact_number',
        'hire_date',
        'monthly_salary',
        'role',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'password' => 'hashed',
        'hire_date' => 'date',
        'monthly_salary' => 'decimal:2',
    ];

    public function stockedInventories()
    {
        return $this->hasMany(Product::class, 'stocked_by', 'id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'recorded_by', 'id');
    }
}

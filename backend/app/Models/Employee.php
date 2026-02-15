<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Employee extends Model
{
    use HasApiTokens;

    protected $table = 'Employee';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'username',
        'password',
        'email',
        'contact_number',
        'hire_date',
        'monthly_salary',
        'role',
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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'Inventory';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'price',
        'sku',
        'stock',
        'last_stocked',
        'stocked_by',
    ];

    public function stockedBy()
    {
        return $this->belongsTo(Employee::class, 'stocked_by', 'id');
    }
}

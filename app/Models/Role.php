<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    const ADMIN_ID = 1;

    const ROLES = [
        ROLE::ADMIN_ID => 'admin',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'name',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public static function adminID()
    {
        return static::ADMIN_ID;
    }

    public static function getID($role)
    {
        return array_search($role, static::ROLES);
    }
}

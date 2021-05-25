<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Session;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use HasProfilePhoto;
    use Notifiable;
    use TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * Privileges granted to this user.
     *
     * @return collection
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function toggleAdmin()
    {
        $this->roles()->toggle([Role::adminID()]);
    }

    public function hasRole($role)
    {
        if(Session::has('has' . $role))
            return Session::get('has' . $role);
        $hasRole = $this->roles->contains(Role::getID($role));
        Session::put('has' . $role, $hasRole);
        return $hasRole;
    }

    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    public function settings()
    {
        return $this->hasMany(UserSetting::class);
    }

    public function getPlaySettingsAttribute() 
    {
        return Setting::settingsObject($this->settings()->whereIn('name', Setting::playSettings)->get());
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Carbon\CarbonInterface;

/* to get data
*    Setting::email()
*  to set data
*    Setting::email('newemail@mail.com')
*/

class Setting extends Model
{
    protected $fillable = [
        'name',
        'data',
    ];
    protected $primaryKey = 'name';
    public $incrementing = false;
    protected $keyType = 'string';

    const ROWS = [
    ];

    const CASTS = [
    ];

    private static function update_($name, $data)
    {
        static::updateOrCreate(compact('name'), compact('data'));
        return $data;
    }

    private static function get_($name)
    {
        $row = static::firstOrCreate(compact('name'));
        $data = $row->data;
        return $data;
    }

    public static function __callStatic($method, $parameters)
    {
        if (in_array($method, static::ROWS)) {
            if (count($parameters) == 0) {
                $value = static::get_($method);
                if (static::castable($method))
                    $value = static::cast($method, $value);
                return $value;
            } else if (count($parameters) == 1) {
                $value = $parameters[0];
                if (static::castable($method))
                    $value = static::uncast($method, $value);
                return static::update_($method, $value);
            }
        }
        return (new static)->$method(...$parameters);
    }

    /* stole ideas from
    *  https://github.com/laravel/framework/blob/master/src/Illuminate/Database/Eloquent/Concerns/HasAttributes.php#L593
    *  But the date casting sucks and I hate it.
    */
    public static function castable($key)
    {
        return key_exists($key, static::CASTS);
    }

    public static function getCast($key)
    {
        if(!static::castable($key))
            return null;

        $cast = static::CASTS[$key];
        if (explode(':', $cast, 2)[0] == 'date')
            $cast = 'date';
        return $cast;
    }

    public static function getFormat($key)
    {
        $cast = static::CASTS[$key];
        $format = explode(':', $cast, 2)[1] ?? "";
        return $format;
    }

    public static function cast($key, $value)
    {
        if (is_null($value))
            return $value;
        $cast = static::getCast($key);
        $format = static::getFormat($key);
        switch ($cast) {
            case 'date':
                return Carbon::createFromFormat($format, $value);
        }
        return $value;
    }

    public static function uncast($key, $value)
    {
        if (is_null($value))
            return $value;
        $cast = static::getCast($key);
        $format = static::getFormat($key);
        switch ($cast) {
            case 'date':
                if($value instanceof CarbonInterface)
                    return $value->format($format);
        }
        return $value;
    }
}

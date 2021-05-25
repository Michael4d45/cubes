<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Models\User;
use App\Models\UserSetting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::all();
        Setting::backgroundColor('0xffffffff');
        foreach ($users as $user) {
            UserSetting::create([
                'user_id' => $user->id,
                'name' => 'backgroundColor',
                'data' => '0xffffffff',
            ]);
        }
    }
}

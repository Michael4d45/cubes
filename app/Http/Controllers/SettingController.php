<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index($page = null) 
    {
        return view('admin', compact('page'));
    }

    public function update(Request $request, string $setting)
    {
        Setting::$setting($request->$setting);
        return redirect()->route('dashboard', $setting);
    }
}

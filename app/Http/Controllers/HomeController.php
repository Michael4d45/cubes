<?php

namespace App\Http\Controllers;

use App\Models\Setting;

class HomeController extends Controller
{
    public function home()
    {
        return view('home');
    }

    public function play()
    {
        if(auth()->check()) 
            $settings = auth()->user()->play_settings;
        else 
            $settings = Setting::playDefaults();

        return view('play', compact('settings'));
    }
}

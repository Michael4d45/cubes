<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('', [HomeController::class, 'home'])->name('home');
Route::get('play', [HomeController::class, 'play'])->name('play');

Route::group(['middleware' => ['auth:sanctum', 'verified', 'role:admin']], function () {
    Route::get('admin/{page?}', [SettingController::class, 'index'])->name('admin');
    Route::put('settings/{setting?}', [SettingController::class, 'update'])->name('settings');
});
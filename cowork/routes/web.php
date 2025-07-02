<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ps4;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/test', [ps4::class,'index'])->name('ps4');
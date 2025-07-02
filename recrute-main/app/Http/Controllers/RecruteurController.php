<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RecruteurController extends Controller
{
    public function index()
    {
        return view('recruteur.dashboard');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{

    public function index()
{
    $applications = Application::with(['user', 'jobOffer'])->get();
    return view('applications.index', compact('applications'));
}


    public function store(Request $request)
    {
        $request->validate([
            'job_offer_id' => 'required|exists:job_offers,id',
        ]);

        Application::create([
            'user_id' => auth()->id(),
            'job_offer_id' => $request->job_offer_id,
        ]);

        return back()->with('success', 'Vous avez postulé avec succès !');
    }
}

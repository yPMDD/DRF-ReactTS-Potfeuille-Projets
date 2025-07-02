<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;

class GuestController extends Controller
{
    public function loginAsGuest()
{
    // Créez un utilisateur simulé pour l'invité
    session(['is_guest' => true]); // Indiquer qu'il s'agit d'un invité
    return redirect()->route('guest.offers');
}

    public function showOffers()
    {
        $offers = JobOffer::all(); // Récupérer toutes les offres
        return view('guest.offers', compact('offers'));
    }
}

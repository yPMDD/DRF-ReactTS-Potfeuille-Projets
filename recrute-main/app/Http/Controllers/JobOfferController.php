<?php
namespace App\Http\Controllers;

use App\Models\JobOffer;
use Illuminate\Http\Request;

class JobOfferController extends Controller
{
    public function index()
    {
        // if (auth()->guest()) {
        //     return redirect()->route('login');
        // }

        // if (auth()->user()->role == 'candidat') {
        //     // Récupérer toutes les offres d'emploi
        //     $offers = JobOffer::all();
        //     return view('offers.index', compact('offers'));
        // }
        
        // $offers = JobOffer::where('user_id', auth()->id())->get();
        // return view('recruter.jobform', compact('offers'));
        return view('recruter.jobform');
    }

    public function create()
    {
        return view('offers.create');
    }

    public function store(Request $request)
{
    // Validation des données
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'location' => 'required|string|max:255',
        'salary' => 'required|numeric',
    ]);

    // Création de l'offre
    JobOffer::create([
        'user_id' => auth()->id(),
        'title' => $validated['title'],
        'description' => $validated['description'],
        'location' => $validated['location'],
        'salary' => $validated['salary'],
    ]);

    // Redirection vers le tableau de bord du recruteur
    return redirect('/guest-offers'); // Changer la redirection ici
}



public function edit(JobOffer $offer)
{
    // Assurez-vous que l'utilisateur est bien le propriétaire de l'offre
    if ($offer->user_id !== auth()->id()) {
        return redirect()->route('dashboard_recruteur')->with('error', 'Accès non autorisé');
    }

    // Afficher le formulaire avec les données de l'offre
    return view('offers.edit', compact('offer'));
}

// Mettre à jour l'offre dans la base de données
public function update(Request $request, JobOffer $offer)
{
    // Validation des données
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'location' => 'required|string|max:255',
        'salary' => 'required|numeric',
    ]);

    // Assurez-vous que l'utilisateur est bien le propriétaire de l'offre
    if ($offer->user_id !== auth()->id()) {
        return redirect()->route('dashboard_recruteur')->with('error', 'Accès non autorisé');
    }

    // Mise à jour de l'offre
    $offer->update([
        'title' => $validated['title'],
        'description' => $validated['description'],
        'location' => $validated['location'],
        'salary' => $validated['salary'],
    ]);

    // Redirection vers le tableau de bord
    return redirect()->route('dashboard_recruteur')->with('success', 'Offre mise à jour avec succès');
}
public function destroy(JobOffer $offer)
{
    // Assurez-vous que l'utilisateur est bien le propriétaire de l'offre
    if ($offer->user_id !== auth()->id()) {
        return redirect()->route('dashboard_recruteur')->with('error', 'Accès non autorisé');
    }

    // Suppression de l'offre
    $offer->delete();

    // Redirection vers le tableau de bord
    return redirect()->route('dashboard_recruteur')->with('success', 'Offre supprimée avec succès');
}
}


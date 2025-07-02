<?php

use App\Http\Controllers\CandidatController;
use App\Http\Controllers\RecruteurController;
use App\Http\Controllers\CVController;
use App\Http\Controllers\LetterController;
use App\Http\Controllers\JobOfferController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\jobform;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return redirect('/login');
});

// Route vers le dashboard
Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    // Vérifier le rôle de l'utilisateur et rediriger en fonction
    if (auth()->user()->role == 'candidat') {
        return view('dashboard'); // View pour le dashboard du candidat
    } elseif (auth()->user()->role == 'recruteur') {
        $offers = \App\Models\JobOffer::where('user_id', auth()->id())->get();
        return view('dashboardR'); // View pour le dashboard du recruteur
    }

    // Si l'utilisateur n'a pas de rôle défini
    return redirect()->route('home'); // Exemple de redirection par défaut
})->name('dashboard');

// Dashboard recruteur
Route::middleware(['auth', 'verified'])->get('/dashboard_recruteur', function () {
    return view('dashboardR');
})->name('dashboard_recruteur');

// Routes pour les CVs (Création, Affichage, Modification, Suppression)
Route::middleware('auth')->group(function () {
    // Routes de profil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});




Route::middleware('auth')->group(function () {
    Route::get('/cvs', [CVController::class, 'index'])->name('cvs.index'); // Affiche la liste des CVs
    Route::get('/cvs/create', [CVController::class, 'create'])->name('cvs.create'); // Formulaire de création de CV
    Route::post('/cvs', [CVController::class, 'store'])->name('cvs.store'); // Route pour enregistrer un CV
    Route::get('/cvs/{cv}/edit', [CVController::class, 'edit'])->name('cvs.edit'); // Formulaire d'édition de CV
    Route::put('/cvs/{cv}', [CVController::class, 'update'])->name('cvs.update'); // Mise à jour d'un CV
    Route::delete('/cvs/{cv}', [CVController::class, 'destroy'])->name('cvs.destroy'); // Suppression d'un CV
});

Route::middleware('auth')->group(function () {
    Route::get('/letter', [LetterController::class, 'index'])->name('letter.index'); // Liste des lettres
    Route::get('/letter/create', [LetterController::class, 'create'])->name('letter.create'); // Formulaire de création
    Route::post('/letter', [LetterController::class, 'store'])->name('letter.store'); // Enregistrement
    Route::get('/letter/{letter}/edit', [LetterController::class, 'edit'])->name('letter.edit'); // Formulaire d'édition
    Route::put('/letter/{letter}', [LetterController::class, 'update'])->name('letter.update'); // Mise à jour
    Route::delete('/letter/{letter}', [LetterController::class, 'destroy'])->name('letter.destroy'); // Suppression
});


Route::middleware(['auth', 'verified'])->get('/offers', [JobOfferController::class, 'index'])->name('offers.index');

Route::middleware(['auth', 'verified'])->get('/dashboard_recruteur', [JobOfferController::class, 'index'])->name('dashboard_recruteur');
Route::middleware(['auth', 'verified'])->get('/offers/create', [JobOfferController::class, 'create'])->name('offers.create');
Route::middleware(['auth', 'verified'])->post('/offers', [JobOfferController::class, 'store'])->name('offers.store');
Route::middleware(['auth', 'verified'])->get('/offers/{offer}/edit', [JobOfferController::class, 'edit'])->name('offers.edit');
Route::middleware(['auth', 'verified'])->put('/offers/{offer}', [JobOfferController::class, 'update'])->name('offers.update');
Route::middleware(['auth', 'verified'])->delete('/offers/{offer}', [JobOfferController::class, 'destroy'])->name('offers.destroy');


Route::post('/applications', [ApplicationController::class, 'store'])->name('applications.store');
Route::get('/applications', [ApplicationController::class, 'index'])->name('applications.index');


Route::get('/guest-offers', [GuestController::class, 'showOffers'])->name('guest.offers');
Route::get('/login-guest', [GuestController::class, 'loginAsGuest'])->name('guest.login');
Route::get('/jobform',[JobOfferController::class, 'index']);
Route::post('/createjob',[JobOfferController::class, 'store']);

require __DIR__.'/auth.php';

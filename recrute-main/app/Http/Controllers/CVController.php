<?php
// app/Http/Controllers/CVController.php
namespace App\Http\Controllers;

use App\Models\CV;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CVController extends Controller
{
    public function index()
    {
        $cvs = CV::where('user_id', auth()->id())->get();
        return view('cvs.index', compact('cvs'));
    }

    public function create()
    {
        return view('cvs.create'); // Renvoie la vue pour créer un CV
    }

    public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'file_path' => 'required|file|mimes:pdf,docx,png,jpg,doc',
    ]);

    
    $filePath = $request->file('file_path')->store('cvs', 'public');

    $cv = new CV();
    $cv->title = $request->title;
    $cv->file_path = $filePath; 
    $cv->user_id = auth()->id(); 
    $cv->save();

    return redirect()->route('cvs.index')->with('success', 'CV créé avec succès!');
}


    public function destroy(CV $cv)
{
    // Vérifie si l'utilisateur est le propriétaire du CV
    $this->authorize('delete', $cv);

    // Supprime le fichier associé au CV
    Storage::disk('public')->delete($cv->file_path);

    // Supprime le CV de la base de données
    $cv->delete();

    // Redirige vers la liste des CVs avec un message de succès
    return redirect()->route('cvs.index')->with('success', 'CV supprimé avec succès.');
}

public function edit(CV $cv)
{
    // Vérifie si l'utilisateur est bien celui du CV
    $this->authorize('update', $cv);

    // Retourne la vue d'édition avec le CV à modifier
    return view('cvs.edit', compact('cv'));
}

public function update(Request $request, CV $cv)
{
    // Vérifie si l'utilisateur est bien le propriétaire du CV
    $this->authorize('update', $cv);

    // Validation des données
    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'file' => 'nullable|mimes:pdf,docx|max:2048',
    ]);

    // Mise à jour des informations
    $cv->title = $request->title;
    $cv->description = $request->description;

    if ($request->hasFile('file')) {
        // Supprimer l'ancien fichier, si nécessaire
        Storage::disk('public')->delete($cv->file_path);

        // Enregistrer le nouveau fichier
        $cv->file_path = $request->file('file')->store('cvs', 'public');
    }

    $cv->save(); // Sauvegarde des modifications

    return redirect()->route('cvs.index')->with('success', 'CV mis à jour avec succès.');
}

}

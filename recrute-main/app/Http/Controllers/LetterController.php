<?php

namespace App\Http\Controllers;

use App\Models\Letter;  // Importer le bon modèle
use Illuminate\Http\Request;

class LetterController extends Controller
{
    public function index()
    {
        $letters = Letter::where('user_id', auth()->id())->get();  // Utiliser Letter au lieu de LetterOfMotivation
        return view('letter.index', compact('letters'));
    }

    public function create()
    {
        return view('letter.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'file_path' => 'required|file|mimes:pdf,docx,png,jpg,doc',
        ]);

        $filePath = $request->file('file_path')->store('letters', 'public');
        
        Letter::create([
            'title' => $request->title,
            'file_path' => $filePath,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('letter.index')->with('success', 'Lettre ajoutée avec succès!');
    }

    public function edit(Letter $letter)
    {
        $this->authorize('update', $letter);
        return view('letter.edit', compact('letter'));
    }

    public function update(Request $request, Letter $letter)
    {
        $this->authorize('update', $letter);

        $request->validate([
            'title' => 'required|string|max:255',
            'file_path' => 'nullable|file|mimes:pdf,docx,png,jpg,doc',
        ]);

        $letter->title = $request->title;

        if ($request->hasFile('file_path')) {
            $filePath = $request->file('file_path')->store('letter', 'public');
            $letter->file_path = $filePath;
        }

        $letter->save();

        return redirect()->route('letter.index')->with('success', 'Lettre mise à jour!');
    }

    public function destroy(Letter $letter)
    {
        $this->authorize('delete', $letter);
        $letter->delete();
        return redirect()->route('letter.index')->with('success', 'Lettre supprimée!');
    }
}


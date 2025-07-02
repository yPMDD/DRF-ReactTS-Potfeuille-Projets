<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Mes CVs') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <h3>Mes CVs</h3>
                    <br>
                    <!-- Bouton pour ajouter un CV -->
                    <div class="mb-4">
                        <a href="{{ route('cvs.create') }}" class="btn btn-success">Ajouter un CV</a>
                    </div>

                    <!-- Liste des CVs -->
                    @if ($cvs->isEmpty())
                        <p>Vous n'avez pas encore ajouté de CV.</p>
                    @else
                        <table class="table-auto w-full text-left">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Fichier</th>
                                    <th>Date de création</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($cvs as $cv)
                                    <tr>
                                        <td>{{ $cv->title }}</td>
                                        <td>
                                            <!-- Affiche un lien cliquable vers le fichier -->
                                            <a href="{{ Storage::url($cv->file_path) }}" target="_blank" class="text-blue-600 hover:underline">
                                                Voir le CV
                                            </a>
                                        </td>
                                        <td>{{ $cv->created_at->format('d/m/Y') }}</td>
                                        <td>
                                            <a href="{{ route('cvs.edit', $cv->id) }}" class="btn btn-primary">Modifier</a>
                                            <form action="{{ route('cvs.destroy', $cv->id) }}" method="POST" class="inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="btn btn-danger" onclick="return confirm('Êtes-vous sûr ?')">Supprimer</button>
                                            </form>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>

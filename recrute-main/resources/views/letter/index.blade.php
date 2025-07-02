<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Mes Lettres de Motivation') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <h3>Mes Lettres de Motivation</h3>
                    <br>
                    <!-- Bouton pour ajouter une lettre de motivation -->
                    <div class="mb-4">
                        <a href="{{ route('letter.create') }}" class="btn btn-success">Ajouter une lettre de motivation</a>
                    </div>

                    <!-- Liste des lettres de motivation -->
                    @if ($letters->isEmpty())
                        <p>Vous n'avez pas encore ajouté de lettre de motivation.</p>
                    @else
                        <table class="table-auto w-full text-left">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Date de création</th>
                                    <th>Fichier</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($letters as $letter)
                                    <tr>
                                        <td>{{ $letter->title }}</td>
                                        <td>{{ $letter->created_at->format('d/m/Y') }}</td>
                                        <td>
                                            <a href="{{ Storage::url($letter->file_path) }}" target="_blank" class="btn btn-info">Voir le fichier</a>
                                        </td>
                                        <td>
                                            <a href="{{ route('letter.edit', $letter->id) }}" class="btn btn-primary">Modifier</a>
                                            <form action="{{ route('letter.destroy', $letter->id) }}" method="POST" class="inline">
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

<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Tableau de Bord Recruteur') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <h3>Vos Offres d'Emploi</h3>
                    <br>
                    
                    <!-- Vérification de la variable $offers -->
                    @if (isset($offers) && $offers->isNotEmpty())
                        <table class="table-auto w-full text-left">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Description</th>
                                    <th>Lieu</th>
                                    <th>Salaire</th>
                                    <th>Date de création</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($offers as $offer)
                                    <tr>
                                        <td>{{ $offer->title }}</td>
                                        <td>{{ Str::limit($offer->description, 50) }}</td>
                                        <td>{{ $offer->location }}</td>  <!-- Affichage du lieu -->
                                        <td>{{ $offer->salary }} €</td>  <!-- Affichage du salaire -->
                                        <td>{{ $offer->created_at->format('d/m/Y') }}</td>
                                        <td>
                                            <a href="{{ route('offers.edit', $offer->id) }}" class="btn btn-primary">Modifier</a>
                                            <form action="{{ route('offers.destroy', $offer->id) }}" method="POST" class="inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="btn btn-danger" onclick="return confirm('Êtes-vous sûr ?')">Supprimer</button>
                                            </form>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    @else
                        <p>Vous n'avez pas encore ajouté d'offres d'emploi.</p>
                    @endif
                    <br>
                    <div class="mb-4">
                        <a href="{{ route('offers.create') }}" class="btn btn-success">Ajouter une offre d'emploi</a>
                    </div>
                    <a href="{{ route('applications.index') }}" class="btn btn-info">Candidats ayant postulé</a>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>

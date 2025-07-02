<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Offres d\'emploi disponibles') }}
        </h2>
    </x-slot>

    <!-- Formulaire global si nécessaire, vérifier si l'offre est définie -->
    @if (!session('is_guest') && isset($offer))
    <form method="POST" action="{{ route('applications.store') }}">
        @csrf
        <input type="hidden" name="job_offer_id" value="{{ $offer->id }}">
        <button type="submit" class="btn btn-success">Postuler</button>
    </form>
    @endif

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <table class="table-auto w-full border-collapse">
                        <thead>
                            <tr>
                                <th class="px-4 py-2 border">Titre</th>
                                <th class="px-4 py-2 border">Lieu</th>
                                <th class="px-4 py-2 border">Salaire</th>
                                <th class="px-4 py-2 border">Description</th>
                                <th class="px-4 py-2 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($offers as $offer)
                                <tr>
                                    <td class="px-4 py-2 border">{{ $offer->title }}</td>
                                    <td class="px-4 py-2 border">{{ $offer->location }}</td>  <!-- Lieu -->
                                    <td class="px-4 py-2 border">{{ $offer->salary }}</td>  <!-- Salaire -->
                                    <td class="px-4 py-2 border">{{ Str::limit($offer->description, 50) }}</td>  <!-- Description -->
                                    <td>
                                        <!-- Formulaire de candidature pour chaque offre -->
                                        <form method="POST" action="{{ route('applications.store') }}">
                                            @csrf
                                            <input type="hidden" name="job_offer_id" value="{{ $offer->id }}">
                                            <button type="submit" class="btn btn-success">Postuler</button>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>

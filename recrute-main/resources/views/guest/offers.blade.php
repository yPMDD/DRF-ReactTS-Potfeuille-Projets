<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Offres d\'Emploi') }}
        </h2>
        <div class="flex justify-center mt-4">
            <a href="{{ route('login') }}" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Se connecter
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <h3>Découvrez nos offres d'emploi</h3>
                    <br>

                    @if ($offers->isEmpty())
                        <p>Aucune offre disponible pour le moment.</p>
                    @else
                        <table class="table-auto w-full text-left">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Description</th>
                                    <th>Lieu</th>
                                    <th>Salaire</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($offers as $offer)
                                    <tr>
                                        <td>{{ $offer->title }}</td>
                                        <td>{{ Str::limit($offer->description, 50) }}</td>
                                        <td>{{ $offer->location }}</td>
                                        <td>{{ $offer->salary }}€</td>
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

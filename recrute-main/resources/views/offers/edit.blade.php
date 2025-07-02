<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Modifier l\'Offre d\'Emploi') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <h3>Modifier l'Offre d'Emploi</h3>

                    <form method="POST" action="{{ route('offers.update', $offer->id) }}">
                        @csrf
                        @method('PUT')

                        <div class="mb-4">
                            <label for="title" class="block text-sm font-medium text-gray-700">Titre de l'offre</label>
                            <input type="text" name="title" id="title" class="mt-1 block w-full" value="{{ old('title', $offer->title) }}" required>
                        </div>

                        <div class="mb-4">
                            <label for="description" class="block text-sm font-medium text-gray-700">Description de l'offre</label>
                            <textarea name="description" id="description" rows="4" class="mt-1 block w-full" required>{{ old('description', $offer->description) }}</textarea>
                        </div>

                        <div class="mb-4">
                            <label for="location" class="block text-sm font-medium text-gray-700">Lieu</label>
                            <input type="text" name="location" id="location" class="mt-1 block w-full" value="{{ old('location', $offer->location) }}" required>
                        </div>

                        <div class="mb-4">
                            <label for="salary" class="block text-sm font-medium text-gray-700">Salaire</label>
                            <input type="number" name="salary" id="salary" class="mt-1 block w-full" value="{{ old('salary', $offer->salary) }}" required>
                        </div>

                        <div class="mb-4">
                            <button type="submit" class="btn btn-primary">Mettre à jour l'offre</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>

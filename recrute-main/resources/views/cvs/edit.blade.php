<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Modifier le CV') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <h3>Modifier le CV</h3>

                    <form action="{{ route('cvs.update', $cv->id) }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        @method('PUT')

                        <div class="mb-4">
                            <label for="title" class="block text-sm font-medium text-gray-700">Titre</label>
                            <input type="text" name="title" id="title" class="form-input mt-1 block w-full" value="{{ $cv->title }}" required>
                        </div>

                        <div class="mb-4">
                            <label for="file_path" class="block text-sm font-medium text-gray-700">Fichier CV (laisser vide pour conserver l'existant)</label>
                            <input type="file" name="file_path" id="file_path" class="form-input mt-1 block w-full" accept=".pdf,.doc,.docx">
                        </div>

                        <button type="submit" class="btn btn-primary">Mettre à jour</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>

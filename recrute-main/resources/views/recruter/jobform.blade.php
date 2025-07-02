<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Ajouter un offre de travail') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    

                    <form action="/createjob" method="POST" enctype="multipart/form-data">
                        @csrf

                        <div class="mb-4">
                            <label for="title" class="block text-sm font-medium text-gray-700">Titre</label>
                            <input type="text" name="title" id="title" class="form-input mt-1 block w-full" required>
                        </div>

                        <div class="mb-4">
                            <label for="title" class="block text-sm font-medium text-gray-700">Description</label>
                            <input type="text" name="description" id="title" class="form-input mt-1 block w-full" required>
                        </div>

                        <div class="mb-4">
                            <label for="title" class="block text-sm font-medium text-gray-700">Salaire</label>
                            <input type="text" name="salary" id="title" class="form-input mt-1 block w-full" required>
                        </div>

                        <div class="mb-4">
                            <label for="title" class="block text-sm font-medium text-gray-700">Localisation</label>
                            <input type="text" name="location" id="title" class="form-input mt-1 block w-full" required>
                        </div>
                        

                        <button type="submit" class="btn btn-success ">Ajouter </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>

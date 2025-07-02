<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Tableau de bord candidat') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    {{ __("You're logged in!") }}
                    <br><br>
                    <a href="{{ route('cvs.index') }}" class="btn btn-primary">
                        Mes CVs
                    </a>
                    <br><br>
                    <a href="{{ route('letter.index') }}" class="btn btn-primary">
                        Mes lettres de motivation
                    </a>
                    <br><br>
                    <a href="{{ route('offers.index') }}" class="btn btn-primary">
                        Voir les offres d'emploi
                    </a>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>

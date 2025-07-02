<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUserIdToJobOffersTable extends Migration
{
    public function up()
    {
        Schema::table('job_offers', function (Blueprint $table) {
            // Ajoute les colonnes location et salary
            $table->string('location')->nullable(); // Permet une valeur nulle pour 'location'
            $table->decimal('salary', 8, 2)->nullable(); // Permet une valeur nulle pour 'salary'

            // Ajoute la clé étrangère user_id
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('job_offers', function (Blueprint $table) {
            // Supprime la clé étrangère user_id et la colonne
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');

            // Supprime les colonnes location et salary
            $table->dropColumn('location');
            $table->dropColumn('salary');
        });
    }
}

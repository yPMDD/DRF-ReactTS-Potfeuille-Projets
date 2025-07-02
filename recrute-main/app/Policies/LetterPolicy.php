<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Letter;
use Illuminate\Auth\Access\HandlesAuthorization;

class LetterPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */

     public function update(User $user, Letter $letter)
    {
        return $user->id === $letter->user_id;  // Vérifier si l'utilisateur est le propriétaire
    }

    public function delete(User $user, Letter $letter)
    {
        return $user->id === $letter->user_id;  // Vérifier si l'utilisateur est le propriétaire
    }
    
    public function __construct()
    {
        //
    }
}

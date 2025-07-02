<?php
// app/Models/Letter.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Letter extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'file_path', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

<?php
// app/Models/CV.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CV extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'file_path', 'user_id'];
    protected $table = 'cvs';
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

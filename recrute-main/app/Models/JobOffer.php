<?php
// app/Models/JobOffer.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobOffer extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'user_id', 'location', 'salary'];
    protected $table = 'job_offers';
    public function user()
{
    return $this->belongsTo(User::class);
}
public function applications()
{
    return $this->hasMany(Application::class);
}

}

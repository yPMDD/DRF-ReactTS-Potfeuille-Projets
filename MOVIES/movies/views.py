from django.http import HttpResponse
from django.shortcuts import render


def home(req):
    return HttpResponse("Home page")

def movies(req):
    return render(req,'movies/movies.html',{'movies':['movie1','movie2']})
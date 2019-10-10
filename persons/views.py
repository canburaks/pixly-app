from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, render_to_response, redirect
from django.http import HttpResponse,HttpResponseRedirect
from items.models import Movie
from django.views.generic import RedirectView
from django.contrib.auth.models import User
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from .models import Profile
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import generic
from items.models import List


class HomeList(generic.ListView):

    context_object_name = 'movie_list'
    #queryset = List.objects.get(id=1).movies.all()
    template_name = 'index.html'
    paginate_by = 40


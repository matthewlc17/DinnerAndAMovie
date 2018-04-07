from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from datetime import datetime
from django.core.mail import send_mail
from django.template.loader import render_to_string, get_template
import requests
from django.contrib.gis.geoip2 import GeoIP2
import json

# Create your views here.
def landingpage(request):

    if request.method == 'POST':
        form = VideoGameForm(request.POST, request=request)
        if form.is_valid():
            form.commit()
            data = form.cleaned_data
            return HttpResponseRedirect('/homepage/theaters/' + data['location'])
    else:
        form = VideoGameForm(request=request)

    # g = GeoIP2()
    # ip = request.META.get('REMOTE_ADDR', None)
    # if ip:
    #     city = g.city(ip)['city']
    #     state = g.city(ip)['state']
    # else:
    #     city = 'Provo'
    #     state = 'UT'
    # address = city + ', ' + state

    context = {
        'form': form,
    }

    return render(request, 'homepage/landingpage.html', context)

class VideoGameForm(forms.Form):
    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(VideoGameForm, self).__init__(*args, **kwargs)

        self.fields['location'] = forms.CharField(label="City, State", required=True, max_length=100, widget=forms.TextInput(attrs={'placeholder':'City, State', 'class':'form-control'}))

    def clean(self):
        cleaned_data = super().clean()

    def commit(self):
        pass

def theaters(request, location):
    url_params = {
        # 'latitude': 40.2599,
        # 'longitude': -111.6692,
        'location': location,
        'radius': 20000,
        'categories': 'movietheaters',
    }
    headers = {
        'Authorization': 'Bearer %s' % 'If7Lz8Ce0ztLHqJgjH1OmYE6AP5v9G8KfkavKSS7ZdGHNp8LFt2aWvLxwOYptHPuaJeP__NvLz94Xl6-dLFNLdubwqhxiIzChk7alsS4zw653MH4fqKZfcz67IbGWnYx',
    }
    response = requests.request('GET', 'https://api.yelp.com/v3/businesses/search', headers=headers, params=url_params)
    myresponse = response.json()
    businesses = []
    # create a list of businesses from the search response
    for business in myresponse.get('businesses'):
        business['distance'] = round((business['distance'] / 1609.34), 2)
        businesses.append(business)

    # Sort the businesses by distance
    for dist in range(len(businesses)-1,0,-1):
        for i in range(dist):
            if businesses[i]['distance']>businesses[i+1]['distance']:
                temp = businesses[i]
                businesses[i] = businesses[i+1]
                businesses[i+1] = temp


    context = {
        'businesses': businesses,
    }

    return render(request, 'homepage/theaters.html', context)

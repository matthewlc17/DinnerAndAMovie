from django.conf import settings
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
import json

# Create your views here.
def landingpage(request):

    if request.method == 'POST':
        form = VideoGameForm(request.POST, request=request)
        if form.is_valid():
            data = form.cleaned_data
            return HttpResponseRedirect('/homepage/theaters/' + data['location'])
    else:
        form = VideoGameForm(request=request)

    context = {
        'form': form,
    }

    return render(request, 'homepage/landingpage.html', context)

class VideoGameForm(forms.Form):
    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(VideoGameForm, self).__init__(*args, **kwargs)

        self.fields['location'] = forms.CharField(label="", required=True, max_length=100, widget=forms.TextInput(attrs={'placeholder':'Provo, UT 84604', 'class':'form-control'}))

    def clean(self):
        cleaned_data = super().clean()

def theaters(request, location):
    url_params = {
        # 'latitude': 40.2599,
        # 'longitude': -111.6692,
        'location': location,
        'radius': 20000,
        'categories': 'movietheaters',
    }
    headers = {
        'Authorization': 'Bearer %s' % settings.YELP_KEY,
    }
    response = requests.request('GET', 'https://api.yelp.com/v3/businesses/search', headers=headers, params=url_params)
    myresponse = response.json()
    businesses = []
    # create a list of businesses from the search response
    for business in myresponse.get('businesses'):
        business['distance'] = round((business['distance'] / 1609.34), 2)
        # url_params = {
        #     'latitude': business['coordinates']['latitude'],
        #     'longitude': business['coordinates']['longitude'],
        #     'radius': 400,
        #     'categories': 'restaurants',
        # }
        # response = requests.request('GET', 'https://api.yelp.com/v3/businesses/search', headers=headers, params=url_params)
        # myresponse = response.json()
        # business["restaurants"] = myresponse
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

def restaurants(request, latitude, longitude):
    url_params = {
        'latitude': latitude,
        'longitude': longitude,
        'radius': 400,
        'categories': 'restaurants',
    }
    headers = {
        'Authorization': 'Bearer %s' % settings.YELP_KEY,
    }
    response = requests.request('GET', 'https://api.yelp.com/v3/businesses/search', headers=headers, params=url_params)
    myresponse = response.json()
    businesses = []
    # create a list of businesses from the search response
    for business in myresponse.get('businesses'):
        # business['distance'] = round((business['distance'] / 1609.34), 2)
        # business['phone'] = business['phone'][1] + ' (' + business['phone'][2:5] + ') ' + business['phone'][5:8] + '-' + business['phone'][8:12]
        businesses.append(business)

    # Sort the businesses by rating
    for rating in range(len(businesses)-1,0,-1):
        for i in range(rating):
            if businesses[i]['rating'] < businesses[i+1]['rating']:
                temp = businesses[i]
                businesses[i] = businesses[i+1]
                businesses[i+1] = temp


    context = {
        'businesses': businesses,
    }

    return render(request, 'homepage/restaurants.html', context)

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

# Create your views here.
def landingpage(request):

    if request.method == 'POST':
        form = VideoGameForm(request.POST, request=request)
        if form.is_valid():
            form.commit()

            return HttpResponseRedirect('/homepage/landingpage/')
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

        self.fields['first_name'] = forms.CharField(label="First Name", required=True, max_length=100, widget=forms.TextInput(attrs={'placeholder':'First Name', 'class':'form-control'}))

    def clean(self):
        cleaned_data = super().clean()

        pass

    def commit(self):
        pass

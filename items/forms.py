from django import forms
from django.forms import ModelForm
from .models import  Movie

class RatingForm(forms.Form):
    CHOICES = ((1,1),(1.5,1.5),(2,2),(2.5,2.5),(3,3),
            (3.5,3.5),(4,4),(4.5,4.5),(5,5))
    rate =  forms.ChoiceField(widget=forms.RadioSelect, choices=CHOICES)
    def clean_rate(self):
        data = self.cleaned_data['rate']
        return data

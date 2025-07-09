# listings/forms.py
from django import forms
from .models import Listing, Category, Message

class ListingForm(forms.ModelForm):
    category_type = forms.ChoiceField(
        choices=[
            ('jobs', 'Jobs'),
            ('housing', 'Housing'),
            ('roommates', 'Roommates'),
            ('legal', 'Legal Services'),
            ('marketplace', 'Marketplace'),
            ('services', 'Services'),
        ],
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    
    class Meta:
        model = Listing
        fields = [
            'title', 'description', 'price', 'currency',
            'location', 'city', 'state_province', 'country',
            'contact_email', 'contact_phone', 'priority', 'expires_at'
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 6}),
            'expires_at': forms.DateInput(attrs={'type': 'date'}),
        }
    
    def save(self, commit=True):
        listing = super().save(commit=False)
        
        # Get or create category based on category_type
        category_type = self.cleaned_data['category_type']
        category, created = Category.objects.get_or_create(
            category_type=category_type,
            defaults={'name': category_type.title()}
        )
        listing.category = category
        
        if commit:
            listing.save()
        return listing

class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ['subject', 'message']
        widgets = {
            'message': forms.Textarea(attrs={'rows': 6}),
        }

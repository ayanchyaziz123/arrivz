# accounts/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm
from allauth.account.forms import SignupForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name', 'password1', 'password2',
                 'country_of_origin', 'current_country', 'immigration_status')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        if commit:
            user.save()
        return user

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'email', 'phone', 'bio', 'profile_picture',
                 'country_of_origin', 'current_country', 'immigration_status', 'languages_spoken')
        widgets = {
            'bio': forms.Textarea(attrs={'rows': 4}),
            'languages_spoken': forms.TextInput(attrs={'placeholder': 'English, Spanish, French'}),
        }

# NEW: Custom Allauth Signup Form
class CustomSignupForm(SignupForm):
    first_name = forms.CharField(
        max_length=30, 
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200',
            'placeholder': 'Your first name'
        })
    )
    last_name = forms.CharField(
        max_length=30, 
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200',
            'placeholder': 'Your last name'
        })
    )
    country_of_origin = forms.ChoiceField(
        choices=[
            ('', 'Select your country'),
            ('us', 'United States'),
            ('mx', 'Mexico'),
            ('in', 'India'),
            ('cn', 'China'),
            ('ph', 'Philippines'),
            ('bd', 'Bangladesh'),
            ('pk', 'Pakistan'),
            ('br', 'Brazil'),
            ('ng', 'Nigeria'),
            ('other', 'Other'),
        ],
        required=False,
        widget=forms.Select(attrs={
            'class': 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200'
        })
    )
    current_country = forms.ChoiceField(
        choices=[
            ('', 'Select current country'),
            ('us', 'United States'),
            ('ca', 'Canada'),
            ('uk', 'United Kingdom'),
            ('au', 'Australia'),
            ('de', 'Germany'),
            ('fr', 'France'),
            ('other', 'Other'),
        ],
        required=False,
        widget=forms.Select(attrs={
            'class': 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200'
        })
    )
    immigration_status = forms.ChoiceField(
        choices=[
            ('', 'Select your status'),
            ('citizen', 'Citizen'),
            ('permanent_resident', 'Permanent Resident'),
            ('work_visa', 'Work Visa'),
            ('student_visa', 'Student Visa'),
            ('refugee', 'Refugee'),
            ('asylum_seeker', 'Asylum Seeker'),
            ('other', 'Other'),
        ],
        required=False,
        widget=forms.Select(attrs={
            'class': 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200'
        })
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add CSS classes to default fields
        self.fields['username'].widget.attrs.update({
            'class': 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200',
            'placeholder': 'Choose a unique username'
        })
        self.fields['email'].widget.attrs.update({
            'class': 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200',
            'placeholder': 'Enter your email address'
        })
        self.fields['password1'].widget.attrs.update({
            'class': 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200',
            'placeholder': 'Create a strong password'
        })
        self.fields['password2'].widget.attrs.update({
            'class': 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200',
            'placeholder': 'Confirm your password'
        })

    def save(self, request):
        user = super().save(request)
        user.first_name = self.cleaned_data.get('first_name', '')
        user.last_name = self.cleaned_data.get('last_name', '')
        user.country_of_origin = self.cleaned_data.get('country_of_origin', '')
        user.current_country = self.cleaned_data.get('current_country', '')
        user.immigration_status = self.cleaned_data.get('immigration_status', '')
        user.save()
        return user
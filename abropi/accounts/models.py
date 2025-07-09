
# accounts/models.py (FIXED VERSION)
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    COUNTRY_CHOICES = [
        ('us', 'United States'),
        ('ca', 'Canada'),
        ('uk', 'United Kingdom'),
        ('de', 'Germany'),
        ('fr', 'France'),
        ('au', 'Australia'),
        ('mx', 'Mexico'),
        ('br', 'Brazil'),
        ('in', 'India'),
        ('cn', 'China'),
        ('jp', 'Japan'),
        ('other', 'Other'),
    ]
    
    IMMIGRATION_STATUS_CHOICES = [
        ('citizen', 'Citizen'),
        ('permanent_resident', 'Permanent Resident'),
        ('work_visa', 'Work Visa'),
        ('student_visa', 'Student Visa'),
        ('refugee', 'Refugee'),
        ('asylum_seeker', 'Asylum Seeker'),
        ('other', 'Other'),
    ]
    COMMUNITY_CHOICES = [
        ('latin_american', 'Latin American Community'),
        ('east_asian', 'East Asian Community'),
        ('south_asian', 'South Asian Community'),
        ('middle_eastern', 'Middle Eastern Community'),
        ('european', 'European Community'),
        ('african', 'African Community'),
        ('caribbean', 'Caribbean Community'),
        ('general', 'General Community'),
    ]
    
    community = models.CharField(
        max_length=20, 
        choices=COMMUNITY_CHOICES, 
        default='general',
        help_text="Choose your community for targeted listings"
    )
    
    def get_regional_community(self):
        """Map country of origin to broader community"""
        country_to_community = {
            'mx': 'latin_american', 'br': 'latin_american',
            'cn': 'east_asian', 'jp': 'east_asian',
            'in': 'south_asian',
            'de': 'european', 'fr': 'european', 'uk': 'european',
            # ... add more mappings
        }
        return country_to_community.get(self.country_of_origin, 'general')
    
    # Fixed: Increased max_length from 2 to 20 to accommodate longer choice values
    phone = models.CharField(max_length=20, blank=True)
    country_of_origin = models.CharField(max_length=20, choices=COUNTRY_CHOICES, blank=True)
    current_country = models.CharField(max_length=20, choices=COUNTRY_CHOICES, blank=True)
    immigration_status = models.CharField(max_length=20, choices=IMMIGRATION_STATUS_CHOICES, blank=True)
    languages_spoken = models.CharField(max_length=200, blank=True, help_text="Comma-separated list")
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.username} - {self.get_country_of_origin_display()}"
    
    

class UserRating(models.Model):
    rated_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='ratings_received')
    rating_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='ratings_given')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('rated_user', 'rating_user')


class EmailOTP(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='email_otp')
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    attempts = models.IntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    
    def is_valid(self):
        return not self.is_verified and timezone.now() < self.expires_at
    
    def is_expired(self):
        return timezone.now() > self.expires_at

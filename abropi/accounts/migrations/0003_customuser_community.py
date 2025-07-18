# Generated by Django 5.2.3 on 2025-07-04 06:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0002_emailotp"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="community",
            field=models.CharField(
                choices=[
                    ("latin_american", "Latin American Community"),
                    ("east_asian", "East Asian Community"),
                    ("south_asian", "South Asian Community"),
                    ("middle_eastern", "Middle Eastern Community"),
                    ("european", "European Community"),
                    ("african", "African Community"),
                    ("caribbean", "Caribbean Community"),
                    ("general", "General Community"),
                ],
                default="general",
                help_text="Choose your community for targeted listings",
                max_length=20,
            ),
        ),
    ]

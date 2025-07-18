# Generated by Django 5.2.3 on 2025-06-30 04:43

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="CustomUser",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        error_messages={
                            "unique": "A user with that username already exists."
                        },
                        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
                        max_length=150,
                        unique=True,
                        validators=[
                            django.contrib.auth.validators.UnicodeUsernameValidator()
                        ],
                        verbose_name="username",
                    ),
                ),
                (
                    "first_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="first name"
                    ),
                ),
                (
                    "last_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="last name"
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        blank=True, max_length=254, verbose_name="email address"
                    ),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",
                        verbose_name="staff status",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(
                        default=True,
                        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
                        verbose_name="active",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="date joined"
                    ),
                ),
                ("phone", models.CharField(blank=True, max_length=20)),
                (
                    "country_of_origin",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("us", "United States"),
                            ("ca", "Canada"),
                            ("uk", "United Kingdom"),
                            ("de", "Germany"),
                            ("fr", "France"),
                            ("au", "Australia"),
                            ("mx", "Mexico"),
                            ("br", "Brazil"),
                            ("in", "India"),
                            ("cn", "China"),
                            ("jp", "Japan"),
                            ("other", "Other"),
                        ],
                        max_length=20,
                    ),
                ),
                (
                    "current_country",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("us", "United States"),
                            ("ca", "Canada"),
                            ("uk", "United Kingdom"),
                            ("de", "Germany"),
                            ("fr", "France"),
                            ("au", "Australia"),
                            ("mx", "Mexico"),
                            ("br", "Brazil"),
                            ("in", "India"),
                            ("cn", "China"),
                            ("jp", "Japan"),
                            ("other", "Other"),
                        ],
                        max_length=20,
                    ),
                ),
                (
                    "immigration_status",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("citizen", "Citizen"),
                            ("permanent_resident", "Permanent Resident"),
                            ("work_visa", "Work Visa"),
                            ("student_visa", "Student Visa"),
                            ("refugee", "Refugee"),
                            ("asylum_seeker", "Asylum Seeker"),
                            ("other", "Other"),
                        ],
                        max_length=20,
                    ),
                ),
                (
                    "languages_spoken",
                    models.CharField(
                        blank=True, help_text="Comma-separated list", max_length=200
                    ),
                ),
                (
                    "profile_picture",
                    models.ImageField(blank=True, null=True, upload_to="profiles/"),
                ),
                ("bio", models.TextField(blank=True, max_length=500)),
                ("is_verified", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "user",
                "verbose_name_plural": "users",
                "abstract": False,
            },
            managers=[
                ("objects", django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name="UserRating",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "rating",
                    models.IntegerField(
                        choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)]
                    ),
                ),
                ("comment", models.TextField(blank=True, max_length=300)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "rated_user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ratings_received",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "rating_user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ratings_given",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "unique_together": {("rated_user", "rating_user")},
            },
        ),
    ]

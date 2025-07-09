# core/templatetags/time_filters.py

from django import template
from django.utils import timezone
from datetime import datetime

register = template.Library()

@register.filter
def short_timesince(value):
    """
    Returns a short, human-readable time difference.
    Examples: 5m, 2h, 3d, 1w, 2mo, 1y
    """
    if not value:
        return 'now'
    
    # Ensure we have a timezone-aware datetime
    now = timezone.now()
    if isinstance(value, datetime):
        if timezone.is_naive(value):
            value = timezone.make_aware(value)
    else:
        return 'now'
    
    # Calculate difference
    diff = now - value
    seconds = int(diff.total_seconds())
    
    # If in the future, return "now"
    if seconds < 0:
        return 'now'
    
    # Define time periods in seconds
    periods = [
        (31536000, 'y'),   # 365 days
        (2629746, 'mo'),   # ~30.44 days (average month)
        (604800, 'w'),     # 7 days
        (86400, 'd'),      # 1 day
        (3600, 'h'),       # 1 hour
        (60, 'm'),         # 1 minute
    ]
    
    for period_seconds, period_name in periods:
        if seconds >= period_seconds:
            period_count = seconds // period_seconds
            return f'{period_count}{period_name}'
    
    # Less than a minute
    return 'now'

@register.filter  
def medium_timesince(value):
    """
    Returns a medium-length, human-readable time difference.
    Examples: 5 min, 2 hrs, 3 days, 1 week
    """
    if not value:
        return 'now'
    
    now = timezone.now()
    if isinstance(value, datetime):
        if timezone.is_naive(value):
            value = timezone.make_aware(value)
    else:
        return 'now'
    
    diff = now - value
    seconds = int(diff.total_seconds())
    
    if seconds < 0:
        return 'now'
    
    # Define time periods
    periods = [
        (31536000, 'year', 'years'),
        (2629746, 'month', 'months'),
        (604800, 'week', 'weeks'),
        (86400, 'day', 'days'),
        (3600, 'hour', 'hours'),
        (60, 'min', 'mins'),
    ]
    
    for period_seconds, singular, plural in periods:
        if seconds >= period_seconds:
            period_count = seconds // period_seconds
            period_name = singular if period_count == 1 else plural
            return f'{period_count} {period_name}'
    
    return 'just now'   
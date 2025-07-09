from django import template

register = template.Library()

@register.filter
def split(value, delimiter=','):
    """Split a string by delimiter and return a list"""
    if not value:
        return []
    return [item.strip() for item in value.split(delimiter) if item.strip()]

@register.filter  
def trim(value):
    """Remove whitespace from string"""
    if not value:
        return ''
    return value.strip()

@register.simple_tag
def country_flag(country_code):
    """Return flag emoji for country code"""
    flags = {
        'us': '🇺🇸', 'ca': '🇨🇦', 'uk': '🇬🇧', 'de': '🇩🇪', 'fr': '🇫🇷',
        'au': '🇦🇺', 'mx': '🇲🇽', 'br': '🇧🇷', 'in': '🇮🇳', 'cn': '🇨🇳',
        'jp': '🇯🇵', 'other': '🌍'
    }
    return flags.get(country_code, '🌍')
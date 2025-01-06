#!/usr/bin/env python

# Import necessary modules
import os
import sys

# Main entry point for the Django project
if __name__ == "__main__":
    # Set the default Django settings module for the 'djaws' project
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djaws.settings")
    try:
        # Import Django's command-line utility for administrative tasks
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # Raise an error if Django is not installed or not available in the environment
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    # Execute the command-line utility with the provided arguments
    execute_from_command_line(sys.argv)

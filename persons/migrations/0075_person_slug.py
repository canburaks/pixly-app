# Generated by Django 2.0.5 on 2019-08-09 09:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('persons', '0074_profile_should_change_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='slug',
            field=models.SlugField(blank=True, max_length=100, null=True, unique=True),
        ),
    ]

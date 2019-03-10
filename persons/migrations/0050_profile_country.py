# Generated by Django 2.0.5 on 2019-02-27 20:58

from django.db import migrations
import django_countries.fields


class Migration(migrations.Migration):

    dependencies = [
        ('persons', '0049_person_short_bio'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='country',
            field=django_countries.fields.CountryField(blank=True, max_length=2, null=True),
        ),
    ]

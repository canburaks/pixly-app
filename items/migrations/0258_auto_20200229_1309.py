# Generated by Django 2.0.5 on 2020-02-29 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0257_movie_header'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='spotify_playlist',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='topic',
            name='spotify_playlist',
            field=models.URLField(blank=True, null=True),
        ),
    ]

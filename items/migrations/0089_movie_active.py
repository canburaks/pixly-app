# Generated by Django 2.0.5 on 2019-06-09 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0088_movie_imdb_votes'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='active',
            field=models.BooleanField(default=False),
        ),
    ]

# Generated by Django 2.0.5 on 2019-11-30 22:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0193_movie_release'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='release',
            field=models.DateField(blank=True, null=True),
        ),
    ]
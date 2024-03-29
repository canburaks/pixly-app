# Generated by Django 2.0.5 on 2018-11-10 19:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0038_remove_movie_lists'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='channel_name',
            field=models.CharField(blank=True, help_text='Name of the Youtube channel', max_length=150, null=True),
        ),
        migrations.AddField(
            model_name='video',
            name='channel_url',
            field=models.URLField(blank=True, help_text="Youtube channel's main page link", null=True),
        ),
    ]

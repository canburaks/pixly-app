# Generated by Django 2.0.5 on 2019-08-30 13:49

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0143_auto_20190830_1620'),
    ]

    operations = [
        migrations.AddField(
            model_name='tag',
            name='award_tag',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='tag',
            name='base_tag',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='tag',
            name='character_tag',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='tag',
            name='era_tag',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='tag',
            name='genre_tag',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='tag',
            name='geo_tag',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='tag',
            name='parent_genres',
            field=django_mysql.models.ListTextField(models.CharField(max_length=100), default=[], help_text='list of parent-genres slugs', size=None),
        ),
        migrations.AddField(
            model_name='tag',
            name='subgenre_tag',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='tag',
            name='topic_tag',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='tag',
            name='video_tag',
            field=models.BooleanField(default=False),
        ),
    ]

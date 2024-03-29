# Generated by Django 2.0.5 on 2018-11-01 14:52

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0026_auto_20181101_1744'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='video',
            name='info',
        ),
        migrations.AlterField(
            model_name='movieimage',
            name='info',
            field=models.CharField(blank=True, max_length=40, null=True),
        ),
        migrations.AlterField(
            model_name='video',
            name='tags',
            field=django_mysql.models.ListTextField(models.CharField(max_length=20), default=[], help_text="Enter the type of video category.\n E.g:'video-essay or interview or conversations'", max_length=20, null=True, size=None),
        ),
    ]

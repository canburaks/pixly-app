# Generated by Django 2.0.5 on 2019-08-26 14:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0135_auto_20190821_0206'),
    ]

    operations = [
        migrations.AddField(
            model_name='tag',
            name='tmdb_id',
            field=models.IntegerField(blank=True, null=True, unique=True),
        ),
    ]

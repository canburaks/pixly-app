# Generated by Django 2.0.5 on 2019-02-08 11:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0080_auto_20190130_0215'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movie',
            name='ratings_dummy',
        ),
        migrations.RemoveField(
            model_name='movie',
            name='ratings_user',
        ),
    ]

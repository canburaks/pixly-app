# Generated by Django 2.0.5 on 2018-10-22 13:41

from django.db import migrations
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('persons', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='ratings',
            field=django_mysql.models.JSONField(default=dict, verbose_name={'movie': {}}),
        ),
    ]

# Generated by Django 2.0.5 on 2019-08-20 13:49

from django.db import migrations
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0131_auto_20190820_1644'),
    ]

    operations = [
        migrations.AddField(
            model_name='list',
            name='rich_data',
            field=django_mysql.models.JSONField(blank=True, default=dict, null=True),
        ),
        migrations.AddField(
            model_name='movie',
            name='rich_data',
            field=django_mysql.models.JSONField(blank=True, default=dict, null=True),
        ),
    ]

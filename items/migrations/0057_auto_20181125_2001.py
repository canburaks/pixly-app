# Generated by Django 2.0.5 on 2018-11-25 17:01

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0056_auto_20181125_1954'),
    ]

    operations = [
        migrations.AlterField(
            model_name='list',
            name='priority',
            field=django_mysql.models.ListTextField(models.IntegerField(), blank=True, default=[], max_length=150, null=True, size=None),
        ),
    ]

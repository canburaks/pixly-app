# Generated by Django 2.0.5 on 2018-11-05 14:29

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0032_auto_20181105_1728'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='ratings_dummy',
            field=django_mysql.models.SetTextField(models.CharField(max_length=15), blank=True, default=set(), null=True, size=None),
        ),
        migrations.AddField(
            model_name='movie',
            name='ratings_user',
            field=django_mysql.models.SetTextField(models.IntegerField(), blank=True, default=set(), null=True, size=None),
        ),
    ]

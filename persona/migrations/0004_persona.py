# Generated by Django 2.0.5 on 2019-04-18 02:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_mysql.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('persona', '0003_auto_20190418_0502'),
    ]

    operations = [
        migrations.CreateModel(
            name='Persona',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False, unique=True)),
                ('similars_dummy', django_mysql.models.JSONField(default=dict)),
                ('similars_real', django_mysql.models.JSONField(default=dict)),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='user')),
            ],
        ),
    ]

# Generated by Django 2.0.5 on 2019-09-12 15:00

from django.db import migrations, models
import django.db.models.deletion
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('persons', '0096_auto_20190912_1759'),
    ]

    operations = [
        migrations.CreateModel(
            name='Info',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tutorial', models.BooleanField(default=True)),
                ('facebook_data', django_mysql.models.JSONField(blank=True, default=dict, null=True)),
                ('facebook_username', models.CharField(blank=True, max_length=40, null=True, unique=True)),
                ('twitter_data', django_mysql.models.JSONField(blank=True, default=dict, null=True)),
                ('twitter_username', models.CharField(blank=True, max_length=40, null=True, unique=True)),
                ('profile', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='info', to='persons.Profile')),
            ],
        ),
    ]

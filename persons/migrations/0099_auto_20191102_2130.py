# Generated by Django 2.0.5 on 2019-11-02 18:30

from django.db import migrations, models
import django.db.models.deletion
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('persons', '0098_auto_20190913_0705'),
    ]

    operations = [
        migrations.CreateModel(
            name='SocialAccounts',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tutorial', models.BooleanField(default=True)),
                ('facebook_data', django_mysql.models.JSONField(blank=True, default=dict, null=True)),
                ('facebook_name', models.CharField(blank=True, max_length=50, null=True, unique=True)),
                ('facebook_id', models.CharField(blank=True, max_length=40, null=True, unique=True)),
                ('facebook_email', models.EmailField(max_length=50, null=True, unique=True)),
                ('facebook_token', models.TextField(blank=True, max_length=5000, null=True)),
                ('facebook_sign', models.TextField(blank=True, max_length=5000, null=True)),
                ('twitter_data', django_mysql.models.JSONField(blank=True, default=dict, null=True)),
                ('twitter_username', models.CharField(blank=True, max_length=40, null=True, unique=True)),
                ('profile', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='social', to='persons.Profile')),
            ],
        ),
        migrations.RemoveField(
            model_name='info',
            name='profile',
        ),
        migrations.DeleteModel(
            name='Info',
        ),
    ]

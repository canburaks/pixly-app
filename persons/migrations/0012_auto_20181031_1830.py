# Generated by Django 2.0.5 on 2018-10-31 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('persons', '0011_profile_follow_director'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='follow_director',
            field=models.ManyToManyField(related_name='follower', to='persons.Person'),
        ),
    ]

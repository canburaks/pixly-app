# Generated by Django 2.0.5 on 2019-04-26 15:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('persona', '0005_recommendation'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recommendation',
            name='movie',
        ),
        migrations.RemoveField(
            model_name='recommendation',
            name='profile',
        ),
        migrations.DeleteModel(
            name='Recommendation',
        ),
    ]

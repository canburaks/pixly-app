# Generated by Django 2.0.5 on 2019-08-17 18:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('persons', '0077_auto_20190817_2052'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='facebook',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='person',
            name='homepage',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='person',
            name='imdb',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='person',
            name='instagram',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='person',
            name='twitter',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='facebook',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='homepage',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='imdb',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='instagram',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='twitter',
            field=models.URLField(blank=True, null=True),
        ),
    ]

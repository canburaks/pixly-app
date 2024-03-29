# Generated by Django 2.0.5 on 2018-11-21 19:30

from django.db import migrations, models
import items.models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0053_auto_20181117_1916'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='priority',
            field=models.IntegerField(blank=True, help_text='Give different priority number for each movie, in order to get sorting.', null=True),
        ),
        migrations.AlterField(
            model_name='topic',
            name='poster',
            field=models.ImageField(blank=True, upload_to=items.models.topic_image_upload_path),
        ),
    ]

# Generated by Django 2.0.5 on 2020-01-21 16:06

from django.db import migrations, models
import items.models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0225_auto_20200121_1704'),
    ]

    operations = [
        migrations.AddField(
            model_name='topicitem',
            name='cover_poster',
            field=models.ImageField(blank=True, null=True, upload_to=items.models.topic_item_cover_poster_path),
        ),
    ]
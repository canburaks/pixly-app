# Generated by Django 2.0.5 on 2019-10-13 13:56

from django.db import migrations, models
import items.models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0162_auto_20191011_1904'),
    ]

    operations = [
        migrations.AddField(
            model_name='list',
            name='large_cover_poster',
            field=models.ImageField(blank=True, null=True, upload_to=items.models.list_large_cover_image_upload_path),
        ),
    ]

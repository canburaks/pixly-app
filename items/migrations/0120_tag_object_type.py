# Generated by Django 2.0.5 on 2019-08-18 20:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0119_auto_20190817_2102'),
    ]

    operations = [
        migrations.AddField(
            model_name='tag',
            name='object_type',
            field=models.CharField(blank=True, choices=[('video', 'Video Content Tags'), ('list', 'List Content Tags'), ('article', 'Article/Blog Post Tags')], max_length=11, null=True),
        ),
    ]

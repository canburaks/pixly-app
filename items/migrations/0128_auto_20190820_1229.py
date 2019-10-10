# Generated by Django 2.0.5 on 2019-08-20 09:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0127_auto_20190819_0522'),
    ]

    operations = [
        migrations.AddField(
            model_name='list',
            name='seo_description',
            field=models.TextField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='list',
            name='seo_keywords',
            field=models.TextField(blank=True, max_length=2000, null=True),
        ),
        migrations.AddField(
            model_name='list',
            name='seo_short_description',
            field=models.TextField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='list',
            name='seo_title',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]

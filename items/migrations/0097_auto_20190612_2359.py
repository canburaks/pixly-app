# Generated by Django 2.0.5 on 2019-06-12 20:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0096_tag_tag_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='tag_type',
            field=models.CharField(blank=True, choices=[('base', 'Based on'), ('city', 'Festival Winner Movies'), ('country', 'Country'), ('genre', 'Genre'), ('era', 'Era movie')], max_length=11, null=True),
        ),
    ]

# Generated by Django 2.0.5 on 2019-10-16 18:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0171_topic_main_page'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='slug',
            field=models.SlugField(blank=True, max_length=100, null=True, unique=True),
        ),
    ]

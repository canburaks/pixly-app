# Generated by Django 2.0.5 on 2019-12-04 21:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='feedpost',
            name='movies',
        ),
        migrations.DeleteModel(
            name='FeedPost',
        ),
    ]

# Generated by Django 2.0.5 on 2019-08-19 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('persons', '0079_auto_20190819_0522'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='work_quantity',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]

# Generated by Django 2.0.5 on 2019-12-21 19:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0203_auto_20191221_2215'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='special_summary',
            field=models.TextField(blank=True, max_length=5000, null=True),
        ),
        migrations.AlterField(
            model_name='movie',
            name='summary',
            field=models.TextField(max_length=1000, null=True),
        ),
    ]

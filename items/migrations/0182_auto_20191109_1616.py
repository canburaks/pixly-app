# Generated by Django 2.0.5 on 2019-11-09 13:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0181_auto_20191109_1615'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topic',
            name='searchable',
            field=models.BooleanField(default=False),
        ),
    ]
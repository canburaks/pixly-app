# Generated by Django 2.0.5 on 2019-10-15 02:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0164_auto_20191015_0316'),
    ]

    operations = [
        migrations.AddField(
            model_name='tag',
            name='summary',
            field=models.TextField(max_length=5000, null=True),
        ),
    ]

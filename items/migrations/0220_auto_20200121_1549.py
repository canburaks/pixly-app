# Generated by Django 2.0.5 on 2020-01-21 12:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0219_auto_20200121_1536'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topic',
            name='is_ordered',
            field=models.BooleanField(default=False, help_text='True for ordered movies and synopsis display.(default=False)'),
        ),
    ]
# Generated by Django 2.0.5 on 2019-08-30 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0149_auto_20190830_1925'),
    ]

    operations = [
        migrations.AddField(
            model_name='tag',
            name='form_tag',
            field=models.BooleanField(default=False, help_text='About form of movie; no-dialogue, dialogue, 70mm etc..'),
        ),
    ]

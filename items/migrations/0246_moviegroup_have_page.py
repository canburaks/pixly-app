# Generated by Django 2.0.5 on 2020-01-29 17:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0245_auto_20200124_2151'),
    ]

    operations = [
        migrations.AddField(
            model_name='moviegroup',
            name='have_page',
            field=models.BooleanField(default=False),
        ),
    ]
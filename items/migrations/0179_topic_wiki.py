# Generated by Django 2.0.5 on 2019-10-19 21:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0178_auto_20191019_1914'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='wiki',
            field=models.URLField(blank=True, null=True),
        ),
    ]
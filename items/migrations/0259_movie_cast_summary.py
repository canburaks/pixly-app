# Generated by Django 2.0.5 on 2020-03-07 23:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0258_auto_20200229_1309'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='cast_summary',
            field=models.TextField(blank=True, max_length=1000, null=True),
        ),
    ]

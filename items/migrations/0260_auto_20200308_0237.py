# Generated by Django 2.0.5 on 2020-03-07 23:37

import ckeditor.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0259_movie_cast_summary'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='cast_summary',
            field=ckeditor.fields.RichTextField(blank=True, help_text='Cast summary', max_length=20000, null=True),
        ),
    ]

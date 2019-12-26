# Generated by Django 2.0.5 on 2019-12-26 14:11

import ckeditor.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0209_topic_hero_poster'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='html_content',
            field=ckeditor.fields.RichTextField(blank=True, help_text='For Feature Movies that will show on Topic Page.', max_length=3000, null=True),
        ),
    ]

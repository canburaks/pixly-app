# Generated by Django 2.0.5 on 2019-11-10 14:42

import ckeditor.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0185_topic_is_article'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='html_content',
            field=ckeditor.fields.RichTextField(blank=True, help_text='Detailed description', max_length=10000, null=True),
        ),
    ]

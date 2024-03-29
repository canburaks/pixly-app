# Generated by Django 2.0.5 on 2019-11-09 13:15

import ckeditor.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0180_topic_searchable'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='html_content',
            field=ckeditor.fields.RichTextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='topic',
            name='summary',
            field=models.TextField(blank=True, help_text='short summary of topic. max: 300 characters', max_length=300, null=True),
        ),
    ]

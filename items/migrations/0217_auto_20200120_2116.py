# Generated by Django 2.0.5 on 2020-01-20 18:16

import ckeditor.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0216_auto_20200120_1454'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topic',
            name='html_content',
            field=ckeditor.fields.RichTextField(blank=True, help_text='Detailed description', max_length=50000, null=True),
        ),
    ]
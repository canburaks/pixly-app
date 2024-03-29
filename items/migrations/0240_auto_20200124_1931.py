# Generated by Django 2.0.5 on 2020-01-24 16:31

import ckeditor.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0239_auto_20200124_1904'),
    ]

    operations = [
        migrations.AlterField(
            model_name='moviegroupitem',
            name='html_content',
            field=ckeditor.fields.RichTextField(blank=True, help_text='Detailed description of the item. Use similar bu unique description for each item in the group', max_length=10000, null=True),
        ),
    ]
